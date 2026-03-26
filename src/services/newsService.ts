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

// Palavras-chave para filtrar notícias por sistema orgânico
const SYSTEM_KEYWORDS: Record<string, string[]> = {
  coração: ['coração', 'cardíaco', 'cardiovascular', 'infarto', 'pressão arterial', 'hipertensão', 'arritmia', 'AVC', 'colesterol', 'triglicérides', 'artéria', 'coronária'],
  fígado: ['fígado', 'hepático', 'hepatite', 'cirrose', 'fígado gorduroso', 'esteatose', 'enzimas hepáticas', 'TGO', 'TGP', 'bilirrubina'],
  rins: ['rim', 'renal', 'diálise', 'transplante renal', 'insuficiência renal', 'nefrologia', 'creatinina', 'ureia', 'filtração'],
  sangue: ['sangue', 'hemoglobina', 'anemia', 'leucemia', 'doação de sangue', 'transfusão', 'hematologia', 'hemograma', 'plaqueta', 'leucócito', 'glóbulos', 'ferro', 'ferritina', 'vitamina B12', 'ácido fólico'],
  intestino: ['intestino', 'intestinal', 'digestivo', 'gastro', 'colonoscopia', 'probiótico', 'flora intestinal', 'microbioma', 'constipação', 'diarreia'],
  pâncreas: ['pâncreas', 'diabetes', 'glicemia', 'insulina', 'diabético', 'açúcar no sangue', 'hemoglobina glicada', 'pré-diabetes'],
  imunidade: ['imunidade', 'imunológico', 'vacina', 'anticorpo', 'imunização', 'defesa', 'sistema imune', 'gripe', 'resfriado', 'infecção', 'vírus', 'bactéria', 'vitamina C', 'vitamina D', 'zinco', 'própolis'],
  urina: ['urinário', 'urina', 'bexiga', 'próstata', 'infecção urinária', 'urologia', 'cistite', 'urocultura'],
};

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

  while ((match = itemRegex.exec(xml)) !== null && index < 20) {
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
 * Filtra notícias por sistema orgânico
 */
export function filterNewsBySystem(news: NewsItem[], system: string): NewsItem[] {
  // Primeiro remove notícias não relacionadas à saúde
  const cleanNews = filterOutExcludedNews(news);

  const systemLower = system.toLowerCase();
  const keywords = SYSTEM_KEYWORDS[systemLower];

  if (!keywords || keywords.length === 0) {
    // Se não há keywords para o sistema, retorna notícias limpas
    return cleanNews.slice(0, 10);
  }

  const filtered = cleanNews.filter(item => {
    const searchText = `${item.title} ${item.description}`.toLowerCase();
    return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
  });

  // Se não encontrou notícias específicas, retorna as 5 primeiras limpas
  if (filtered.length === 0) {
    return cleanNews.slice(0, 5);
  }

  return filtered;
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
