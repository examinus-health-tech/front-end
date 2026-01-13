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
  coração: ['coração', 'cardíaco', 'cardiovascular', 'infarto', 'pressão arterial', 'hipertensão', 'arritmia', 'AVC'],
  fígado: ['fígado', 'hepático', 'hepatite', 'cirrose', 'fígado gorduroso', 'esteatose'],
  rins: ['rim', 'renal', 'diálise', 'transplante renal', 'insuficiência renal', 'nefrologia'],
  sangue: ['sangue', 'hemoglobina', 'anemia', 'leucemia', 'doação de sangue', 'transfusão', 'hematologia'],
  intestino: ['intestino', 'intestinal', 'digestivo', 'gastro', 'colonoscopia', 'probiótico'],
  pâncreas: ['pâncreas', 'diabetes', 'glicemia', 'insulina', 'diabético'],
  imunidade: ['imunidade', 'imunológico', 'vacina', 'anticorpo', 'imunização', 'defesa'],
  urina: ['urinário', 'urina', 'bexiga', 'próstata', 'infecção urinária', 'urologia'],
};

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
    console.log('📰 [NewsService] Retornando notícias do cache');
    return newsCache;
  }

  try {
    console.log('📰 [NewsService] Buscando notícias do G1 Bem Estar...');

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
    console.log(`📰 [NewsService] Recebidos ${xml.length} caracteres do RSS`);
    const news = parseRssXml(xml);

    // Atualiza cache
    newsCache = news;
    lastFetchTime = now;

    console.log(`✅ [NewsService] ${news.length} notícias carregadas`);
    return news;
  } catch (error) {
    console.error('❌ [NewsService] Erro ao buscar notícias:', error);

    // Retorna cache antigo se disponível
    if (newsCache.length > 0) {
      console.log('📰 [NewsService] Retornando cache antigo devido a erro');
      return newsCache;
    }

    return [];
  }
}

/**
 * Filtra notícias por sistema orgânico
 */
export function filterNewsBySystem(news: NewsItem[], system: string): NewsItem[] {
  const systemLower = system.toLowerCase();
  const keywords = SYSTEM_KEYWORDS[systemLower];

  if (!keywords || keywords.length === 0) {
    // Se não há keywords para o sistema, retorna todas as notícias
    return news;
  }

  const filtered = news.filter(item => {
    const searchText = `${item.title} ${item.description}`.toLowerCase();
    return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
  });

  // Se não encontrou notícias específicas, retorna as 5 primeiras gerais
  if (filtered.length === 0) {
    return news.slice(0, 5);
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
