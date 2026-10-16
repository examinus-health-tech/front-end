// Dicas curadas por sistema orgânico, exibidas em "Dicas para <sistema>" (tela de score
// do sistema) junto com as notícias realmente temáticas do feed.
//
// Conteúdo inicial — REVISAR com o time de saúde antes de expandir.
// Links verificados em 2026-10-16 (HTTP 200 + título da página conferido).
// Fontes: Ministério da Saúde (gov.br/saude e BVS), INCA e sociedades médicas.

export type OrganTip = {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
};

const MS = 'Ministério da Saúde';
const BVS = 'BVS · Ministério da Saúde';

// Chaves sem acento e minúsculas (ver getOrganTips)
export const ORGAN_TIPS: Record<string, OrganTip[]> = {
  sangue: [
    {
      id: 'sangue-anemia',
      title: 'Anemia: sinais de alerta',
      description: 'Cansaço, fraqueza e palidez podem indicar anemia. Vale investigar a causa com seu médico.',
      source: BVS,
      url: 'https://bvsms.saude.gov.br/anemia/',
    },
    {
      id: 'sangue-ferro',
      title: 'Ferro no dia a dia',
      description: 'Carnes, feijões e folhas verde-escuras são fontes de ferro; frutas com vitamina C ajudam na absorção.',
      source: BVS,
      url: 'https://bvsms.saude.gov.br/anemia-ferropriva/',
    },
    {
      id: 'sangue-doacao',
      title: 'Doar sangue salva vidas',
      description: 'Veja quem pode doar, o intervalo entre as doações e como encontrar um hemocentro.',
      source: MS,
      url: 'https://www.gov.br/saude/pt-br/assuntos/doacao-de-sangue',
    },
  ],
  coracao: [
    {
      id: 'coracao-pressao',
      title: 'Pressão alta costuma ser silenciosa',
      description: 'A hipertensão geralmente não dá sintomas. Medir a pressão com regularidade ajuda a prevenir complicações.',
      source: MS,
      url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/h/hipertensao',
    },
    {
      id: 'coracao-colesterol',
      title: 'Colesterol sob controle',
      description: 'Alimentação equilibrada e atividade física ajudam a manter o colesterol em níveis saudáveis.',
      source: BVS,
      url: 'https://bvsms.saude.gov.br/colesterol/',
    },
    {
      id: 'coracao-infarto',
      title: 'Saiba reconhecer um infarto',
      description: 'Dor ou aperto no peito, que pode irradiar para braço ou mandíbula, exige atendimento imediato: ligue 192.',
      source: MS,
      url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/i/infarto',
    },
  ],
  figado: [
    {
      id: 'figado-hepatites',
      title: 'Hepatites virais: prevenção e teste',
      description: 'Existe vacina contra a hepatite B, e o SUS oferece testes rápidos gratuitos para as hepatites B e C.',
      source: MS,
      url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/h/hepatites-virais',
    },
    {
      id: 'figado-esteatose',
      title: 'Gordura no fígado (esteatose)',
      description: 'Manter o peso saudável, moderar o álcool e comer de forma equilibrada ajudam a prevenir a esteatose.',
      source: BVS,
      url: 'https://bvsms.saude.gov.br/esteatose-hepatica/',
    },
  ],
  rins: [
    {
      id: 'rins-prevencao',
      title: 'Insuficiência renal: causas e prevenção',
      description: 'Desidratação e uso de alguns remédios sem orientação estão entre as causas. Beba água e evite a automedicação.',
      source: BVS,
      url: 'https://bvsms.saude.gov.br/insuficiencia-renal/',
    },
    {
      id: 'rins-pressao',
      title: 'Pressão controlada protege os rins',
      description: 'A pressão alta é uma das principais causas de doença renal. Acompanhar a pressão ajuda a proteger os rins.',
      source: MS,
      url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/h/hipertensao',
    },
    {
      id: 'rins-sbn',
      title: 'Saúde dos rins',
      description: 'Informações da Sociedade Brasileira de Nefrologia sobre prevenção e doenças renais.',
      source: 'Sociedade Brasileira de Nefrologia',
      url: 'https://www.sbn.org.br/',
    },
  ],
  pancreas: [
    {
      id: 'pancreas-diabetes',
      title: 'Diabetes: prevenção e controle',
      description: 'Alimentação equilibrada, atividade física e acompanhamento regular ajudam a prevenir e controlar o diabetes.',
      source: MS,
      url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/d/diabetes',
    },
    {
      id: 'pancreas-sinais',
      title: 'Sinais que merecem atenção',
      description: 'Muita sede, vontade frequente de urinar e cansaço podem ser sinais de glicose alta. Converse com seu médico.',
      source: MS,
      url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/d/diabetes',
    },
  ],
  intestino: [
    {
      id: 'intestino-fibras',
      title: 'Fibras e água para o intestino',
      description: 'Frutas, verduras, grãos integrais e boa hidratação ajudam a manter o intestino funcionando bem.',
      source: BVS,
      url: 'https://bvsms.saude.gov.br/constipacao-intestinal/',
    },
    {
      id: 'intestino-cancer',
      title: 'Câncer de intestino: fique atento',
      description: 'Sangue nas fezes ou mudança persistente no hábito intestinal merecem avaliação médica.',
      source: 'INCA',
      url: 'https://www.gov.br/inca/pt-br/assuntos/cancer/tipos/intestino',
    },
  ],
  imunidade: [
    {
      id: 'imunidade-vacinas',
      title: 'Vacinação em dia',
      description: 'Confira no calendário do SUS quais vacinas são indicadas para a sua idade.',
      source: MS,
      url: 'https://www.gov.br/saude/pt-br/vacinacao/calendario',
    },
    {
      id: 'imunidade-sono',
      title: 'Sono também é defesa',
      description: 'Dormir bem ajuda o organismo a se recuperar e contribui para o bom funcionamento das defesas.',
      source: BVS,
      url: 'https://bvsms.saude.gov.br/sono/',
    },
  ],
  urina: [
    {
      id: 'urina-cistite',
      title: 'Infecção urinária (cistite)',
      description: 'Ardor ao urinar e vontade frequente podem indicar cistite. Beba água e procure orientação médica.',
      source: BVS,
      url: 'https://bvsms.saude.gov.br/cistite/',
    },
    {
      id: 'urina-sbu',
      title: 'Saúde urológica',
      description: 'Conteúdo da Sociedade Brasileira de Urologia sobre rins, bexiga e próstata.',
      source: 'Sociedade Brasileira de Urologia',
      url: 'https://portaldaurologia.org.br/',
    },
  ],
  hormonios: [
    {
      id: 'hormonios-sbem',
      title: 'Hormônios e metabolismo',
      description: 'A Sociedade Brasileira de Endocrinologia explica como os hormônios influenciam o corpo e quando procurar um especialista.',
      source: 'Sociedade Brasileira de Endocrinologia',
      url: 'https://www.endocrino.org.br/',
    },
    {
      id: 'hormonios-menopausa',
      title: 'Menopausa e climatério',
      description: 'Entenda as mudanças hormonais dessa fase e quando buscar acompanhamento.',
      source: BVS,
      url: 'https://bvsms.saude.gov.br/menopausa/',
    },
    {
      id: 'hormonios-sono',
      title: 'Rotina de sono regular',
      description: 'Dormir em horários regulares favorece o equilíbrio do organismo, incluindo a produção de hormônios.',
      source: BVS,
      url: 'https://bvsms.saude.gov.br/sono/',
    },
  ],
  tireoide: [
    {
      id: 'tireoide-hipo',
      title: 'Hipotireoidismo',
      description: 'Cansaço, ganho de peso e sensação de frio podem estar ligados à tireoide funcionando devagar.',
      source: BVS,
      url: 'https://bvsms.saude.gov.br/hipotireoidismo/',
    },
    {
      id: 'tireoide-hiper',
      title: 'Hipertireoidismo',
      description: 'Palpitações, perda de peso e nervosismo podem indicar a tireoide acelerada. Procure avaliação médica.',
      source: BVS,
      url: 'https://bvsms.saude.gov.br/hipertireoidismo/',
    },
  ],
};

// "Tireóide" / "Pâncreas" (nome vindo do backend) → chave sem acento
export function getOrganTips(system?: string): OrganTip[] {
  if (!system) return [];
  const key = system.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  return ORGAN_TIPS[key] ?? [];
}
