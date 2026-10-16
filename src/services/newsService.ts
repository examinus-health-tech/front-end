// Service para buscar notícias de saúde do RSS do Ministério da Saúde

export type NewsItem = {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  imageUrl?: string;
};

// Cache para evitar requisições desnecessárias
let newsCache: NewsItem[] = [];
let lastFetchTime: number = 0;
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutos

// URLs de RSS de saúde
const RSS_URLS = {
  geral: 'https://g1.globo.com/rss/g1/bemestar/',
};

// O feed é genérico (todos os temas de saúde); lemos o máximo que ele oferece para
// aumentar a chance de achar notícias realmente sobre cada sistema orgânico.
const MAX_RSS_ITEMS = 100;

// Palavras-chave por sistema orgânico. Chaves sem acento (ver normalizeText) para casar
// com o nome que vem do backend ("Tireóide", "Pâncreas"...). Inclui plural/feminino
// porque a busca é por palavra inteira.
const SYSTEM_KEYWORDS: Record<string, string[]> = {
  coracao: ['coração', 'cardíaco', 'cardíaca', 'cardiovascular', 'cardiovasculares', 'infarto', 'pressão arterial', 'pressão alta', 'hipertensão', 'arritmia', 'AVC', 'colesterol', 'triglicérides', 'artéria', 'artérias', 'coronária', 'cardiologista'],
  figado: ['fígado', 'hepático', 'hepática', 'hepatite', 'hepatites', 'cirrose', 'esteatose', 'TGO', 'TGP', 'bilirrubina'],
  rins: ['rim', 'rins', 'renal', 'renais', 'diálise', 'nefrologia', 'nefrologista', 'creatinina', 'ureia', 'cálculo renal', 'pedra nos rins'],
  sangue: ['sangue', 'sanguíneo', 'sanguínea', 'hemoglobina', 'anemia', 'leucemia', 'transfusão', 'hematologia', 'hemograma', 'plaqueta', 'plaquetas', 'leucócitos', 'glóbulos', 'ferro', 'ferritina', 'vitamina B12', 'ácido fólico', 'hemocentro'],
  intestino: ['intestino', 'intestinal', 'intestinais', 'digestão', 'colonoscopia', 'probiótico', 'probióticos', 'microbiota', 'microbioma', 'constipação', 'prisão de ventre', 'diarreia', 'colorretal'],
  pancreas: ['pâncreas', 'pancreatite', 'diabetes', 'diabético', 'diabética', 'glicemia', 'glicose', 'insulina', 'pré-diabetes', 'hemoglobina glicada'],
  imunidade: ['imunidade', 'imunológico', 'imunológica', 'vacina', 'vacinas', 'vacinação', 'anticorpo', 'anticorpos', 'imunização', 'sistema imune', 'gripe', 'resfriado', 'vitamina C', 'vitamina D', 'zinco'],
  urina: ['urina', 'urinário', 'urinária', 'bexiga', 'próstata', 'infecção urinária', 'urologia', 'urologista', 'cistite', 'incontinência urinária'],
  hormonios: ['hormônio', 'hormônios', 'hormonal', 'hormonais', 'menopausa', 'climatério', 'testosterona', 'estrogênio', 'cortisol', 'endocrinologia', 'endocrinologista', 'reposição hormonal'],
  tireoide: ['tireoide', 'tireóide', 'tiroide', 'hipotireoidismo', 'hipertireoidismo', 'TSH', 'T4', 'iodo'],
};

// Minúsculas e sem acento: "Tireóide" → "tireoide"
export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Palavra/expressão inteira, sem diferenciar acento — evita "rim" casar com "primeiro"
export function matchesKeyword(text: string, keyword: string): boolean {
  const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegex(normalizeText(keyword))}($|[^a-z0-9])`);
  return pattern.test(normalizeText(text));
}

// Palavras-chave para EXCLUIR notícias (golpes, política, etc)
const EXCLUDED_KEYWORDS: string[] = [
  'golpe', 'golpista', 'fraude', 'criminoso', 'crime', 'polícia', 'prisão', 'preso',
  'assassinato', 'morte violenta', 'homicídio', 'roubo', 'assalto', 'sequestro',
  'político', 'política', 'eleição', 'deputado', 'senador', 'presidente', 'governo',
  'dinheiro', 'banco', 'empréstimo', 'investimento', 'bitcoin', 'criptomoeda',
  'celebridade', 'famoso', 'fofoca', 'reality', 'bbb',
];

// Palavras-chave para filtrar notícias por categorias de dicas de saúde
const HEALTH_TIPS_KEYWORDS: string[] = [
  // Imunidade
  'imunidade', 'imunológico', 'sistema imune', 'defesa', 'anticorpo', 'vacina',
  // Hábitos saudáveis
  'hábito', 'rotina', 'estilo de vida', 'qualidade de vida', 'bem-estar', 'exercício', 'atividade física',
  'sedentarismo', 'sedentário', 'caminhada', 'treino', 'academia',
  // Alimentação
  'alimentação', 'alimentar', 'dieta', 'nutrição', 'nutricional', 'comer', 'comida', 'alimento',
  'fruta', 'verdura', 'legume', 'proteína', 'vitamina', 'mineral', 'saudável',
  // Prevenção
  'prevenção', 'prevenir', 'evitar', 'cuidado', 'check-up', 'exame preventivo', 'diagnóstico precoce',
  'saúde mental', 'ansiedade', 'depressão', 'sono', 'dormir', 'hidratação', 'água',
];

/**
 * Extrai texto de uma tag XML
 */
function extractTagContent(xml: string, tagName: string): string {
  // Primeiro tenta CDATA (com suporte a conteúdo que contenha ])
  const cdataRegex = new RegExp(`<${tagName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tagName}>`, 'i');
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) {
    return cdataMatch[1].trim();
  }

  // Depois tenta conteúdo simples
  const simpleRegex = new RegExp(`<${tagName}[^>]*>([^<]*)</${tagName}>`, 'i');
  const simpleMatch = xml.match(simpleRegex);
  if (simpleMatch) {
    return simpleMatch[1].trim();
  }

  return '';
}

/**
 * Extrai URL de imagem do conteúdo
 */
function extractImageUrl(content: string): string | undefined {
  // Tenta encontrar imagem em enclosure
  const enclosureMatch = content.match(/<enclosure[^>]*url="([^"]+)"[^>]*type="image/i);
  if (enclosureMatch) {
    return enclosureMatch[1];
  }

  // Tenta encontrar imagem em media:content
  const mediaMatch = content.match(/<media:content[^>]*url="([^"]+)"/i);
  if (mediaMatch) {
    return mediaMatch[1];
  }

  // Tenta encontrar imagem em description
  const imgMatch = content.match(/<img[^>]*src="([^"]+)"/i);
  if (imgMatch) {
    return imgMatch[1];
  }

  return undefined;
}

/**
 * Limpa HTML do texto
 */
function cleanHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parseia o RSS XML e retorna lista de notícias
 */
function parseRssXml(xml: string): NewsItem[] {
  const items: NewsItem[] = [];

  // Encontra todos os itens
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  let index = 0;

  while ((match = itemRegex.exec(xml)) !== null && index < MAX_RSS_ITEMS) {
    const itemXml = match[1];

    const title = cleanHtml(extractTagContent(itemXml, 'title'));
    const description = cleanHtml(extractTagContent(itemXml, 'description'));
    const link = extractTagContent(itemXml, 'link');
    const pubDate = extractTagContent(itemXml, 'pubDate');
    const imageUrl = extractImageUrl(itemXml);

    if (title && link) {
      items.push({
        id: `news-${index}-${Date.now()}`,
        title,
        description: description.substring(0, 200) + (description.length > 200 ? '...' : ''),
        link,
        pubDate,
        imageUrl,
      });
      index++;
    }
  }

  return items;
}

/**
 * Busca notícias do RSS do Ministério da Saúde
 */
export async function fetchHealthNews(): Promise<NewsItem[]> {
  // Retorna cache se ainda válido
  const now = Date.now();
  if (newsCache.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
    if (__DEV__) console.log('📰 [NewsService] Retornando notícias do cache');
    return newsCache;
  }

  try {
    if (__DEV__) console.log('📰 [NewsService] Buscando notícias do G1 Bem Estar...');

    const response = await fetch(RSS_URLS.geral, {
      method: 'GET',
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Encoding': 'gzip, deflate',
        'User-Agent': 'Mozilla/5.0 (compatible; Examinus/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xml = await response.text();
    if (__DEV__) console.log(`📰 [NewsService] Recebidos ${xml.length} caracteres do RSS`);
    const news = parseRssXml(xml);

    // Atualiza cache
    newsCache = news;
    lastFetchTime = now;

    if (__DEV__) console.log(`✅ [NewsService] ${news.length} notícias carregadas`);
    return news;
  } catch (error) {
    if (__DEV__) console.error('❌ [NewsService] Erro ao buscar notícias:', error);

    // Retorna cache antigo se disponível
    if (newsCache.length > 0) {
      if (__DEV__) console.log('📰 [NewsService] Retornando cache antigo devido a erro');
      return newsCache;
    }

    return [];
  }
}

/**
 * Remove notícias com conteúdo não relacionado à saúde (golpes, política, etc)
 */
function filterOutExcludedNews(news: NewsItem[]): NewsItem[] {
  return news.filter(item => {
    const searchText = `${item.title} ${item.description}`.toLowerCase();
    return !EXCLUDED_KEYWORDS.some(keyword => searchText.includes(keyword.toLowerCase()));
  });
}

/**
 * Filtra notícias por sistema orgânico.
 *
 * Só aceita notícias cujo TÍTULO fala do sistema (palavra inteira, sem acento). Citar o
 * tema só na descrição não basta: "Câncer gástrico…" mencionava sangue como sintoma e
 * aparecia em "Dicas para Sangue". Sem match → lista vazia (nada de notícia genérica);
 * a tela completa com dicas curadas (src/data/organTips.ts).
 */
export function filterNewsBySystem(news: NewsItem[], system: string): NewsItem[] {
  const keywords = SYSTEM_KEYWORDS[normalizeText(system)];
  if (!keywords || keywords.length === 0) return [];

  return filterOutExcludedNews(news).filter(item =>
    keywords.some(keyword => matchesKeyword(item.title, keyword)),
  );
}

/**
 * Busca notícias filtradas por sistema orgânico
 */
export async function fetchNewsForSystem(system: string): Promise<NewsItem[]> {
  const allNews = await fetchHealthNews();
  return filterNewsBySystem(allNews, system);
}

/**
 * Filtra notícias por categorias de dicas de saúde (imunidade, hábitos, alimentação, prevenção)
 */
export function filterNewsByHealthTips(news: NewsItem[]): NewsItem[] {
  // Primeiro remove notícias não relacionadas à saúde
  const cleanNews = filterOutExcludedNews(news);

  const filtered = cleanNews.filter(item => {
    const searchText = `${item.title} ${item.description}`.toLowerCase();
    return HEALTH_TIPS_KEYWORDS.some(keyword => searchText.includes(keyword.toLowerCase()));
  });

  // Se encontrou notícias específicas, retorna elas
  if (filtered.length > 0) {
    return filtered;
  }

  // Se não encontrou, retorna as notícias limpas (sem golpes)
  return cleanNews.slice(0, 10);
}

/**
 * Busca notícias filtradas por categorias de dicas de saúde
 */
export async function fetchHealthTipsNews(): Promise<NewsItem[]> {
  const allNews = await fetchHealthNews();
  return filterNewsByHealthTips(allNews);
}

/**
 * Formata a data de publicação para exibição (Dia da semana + data)
 */
export function formatPubDate(pubDate: string): string {
  try {
    const date = new Date(pubDate);

    // Dias da semana abreviados em português
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const dayOfWeek = weekDays[date.getDay()];

    // Formata a data
    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).replace('.', '');

    return `${dayOfWeek}, ${formattedDate}`;
  } catch {
    return '';
  }
}
