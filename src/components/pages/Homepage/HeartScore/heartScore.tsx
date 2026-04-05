import { useEffect, useRef, useMemo } from 'react';
import { VStack, Text, Box, HStack, ScrollView, Image } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import {
  BarbellIcon,
  ChevronRightIcon,
  HeadHealtthIcon,
  HeartIcon,
  HeartbeatIcon,
  PillIcon,
  StethoscopeIcon,
  FigIcon,
  ImuIcon,
  PanIcon,
  RinIcon,
  SanIcon,
  IntestineIcon,
  UrinaIcon,
  FlaskIcon,
  WarningIcon,
  ChecklistIcon,
  ChartIcon,
  ShieldIcon,
  WaterIcon,
  EnergyIcon,
  LeafIcon,
  ThermometerIcon,
  BloodDripIcon,
  VirusIcon,
  HormonioIcon,
  TireoideIcon,
} from '@assets/icons';
import VectorMale from '@assets/png/vector-46.png';
import VectorFemale from '@assets/png/vector-33.png';
import VectorRiskMale from '@assets/png/vector-47.png';
import VectorRiskFemale from '@assets/png/vector-23.png';
import AlertMale from '@assets/png/alert-man.png';
import AlertFemale from '@assets/png/alert-woman.png';

// components
import { HeaderTitle, NewsCarousel, SystemInsights } from '@components/molecules';
import { useHome } from 'src/hooks/useHome';
import { useOnboarding } from 'src/hooks/useOnboarding';

// Tipo para informações educacionais de cada sistema
type SystemInfoItem = {
  title: string;
  description: string;
  iconComponent: React.ReactNode;
  color: string;
  bgColor: string;
};

type SystemEducationalData = {
  sectionTitle: string;
  mainIcon: React.ReactNode;
  mainColor: string;
  info: SystemInfoItem[];
  tips: string[];
  tipsTitle: string;
  tipsBgColor: string;
  tipsTextColor: string;
};

// Dados educacionais para cada sistema orgânico
const systemEducationalContent: Record<string, SystemEducationalData> = {
  coração: {
    sectionTitle: 'Entenda sua Frequência Cardíaca',
    mainIcon: <HeartIcon size="24" color="#EF4444" />,
    mainColor: '#EF4444',
    info: [
      {
        title: 'Frequência Cardíaca em Repouso',
        description:
          'A FC em repouso normal para adultos varia entre 60 e 100 bpm. Atletas podem ter valores mais baixos (40-60 bpm), indicando boa saúde cardiovascular.',
        iconComponent: <HeartIcon size="20" color="#EF4444" />,
        color: '#EF4444',
        bgColor: '#FEF2F2',
      },
      {
        title: 'FC Alta (Taquicardia)',
        description:
          'Acima de 100 bpm em repouso pode indicar estresse, ansiedade, desidratação, febre ou problemas cardíacos. Consulte um médico se persistir.',
        iconComponent: <EnergyIcon size="20" color="#F97316" />,
        color: '#F97316',
        bgColor: '#FFF7ED',
      },
      {
        title: 'FC Baixa (Bradicardia)',
        description:
          'Abaixo de 60 bpm pode ser normal em atletas, mas também pode indicar problemas no sistema elétrico do coração. Avalie com um especialista.',
        iconComponent: <HeartbeatIcon size="20" color="#3B82F6" />,
        color: '#3B82F6',
        bgColor: '#EFF6FF',
      },
      {
        title: 'Variabilidade da FC',
        description:
          'Uma boa variabilidade entre batimentos indica saúde cardiovascular. Baixa variabilidade pode estar associada a estresse crônico.',
        iconComponent: <ChartIcon size="20" color="#8B5CF6" />,
        color: '#8B5CF6',
        bgColor: '#F5F3FF',
      },
    ],
    tips: [
      'Pratique exercícios aeróbicos regularmente (30 min/dia)',
      'Mantenha uma dieta rica em fibras e baixa em gorduras saturadas',
      'Controle o estresse com técnicas de relaxamento',
      'Evite o tabagismo e limite o consumo de álcool',
      'Monitore sua pressão arterial regularmente',
      'Durma de 7 a 9 horas por noite',
    ],
    tipsTitle: 'Dicas para Saúde Cardíaca',
    tipsBgColor: 'red.50',
    tipsTextColor: 'red',
  },
  fígado: {
    sectionTitle: 'Entenda seu Fígado',
    mainIcon: <FigIcon size="24" color="#22C55E" />,
    mainColor: '#22C55E',
    info: [
      {
        title: 'Função Hepática',
        description:
          'O fígado é responsável por filtrar toxinas, produzir bile para digestão e armazenar vitaminas e minerais essenciais.',
        iconComponent: <FigIcon size="20" color="#22C55E" />,
        color: '#22C55E',
        bgColor: '#F0FDF4',
      },
      {
        title: 'Enzimas Hepáticas (TGO/TGP)',
        description:
          'Níveis elevados de TGO e TGP podem indicar lesão hepática. Valores normais variam, mas geralmente são abaixo de 40 U/L.',
        iconComponent: <ChartIcon size="20" color="#F97316" />,
        color: '#F97316',
        bgColor: '#FFF7ED',
      },
      {
        title: 'Esteatose Hepática',
        description:
          'Acúmulo de gordura no fígado é comum e pode evoluir para problemas mais graves. Dieta e exercícios são fundamentais.',
        iconComponent: <WarningIcon size="20" color="#EAB308" />,
        color: '#EAB308',
        bgColor: '#FEFCE8',
      },
      {
        title: 'Bilirrubina',
        description:
          'Níveis altos podem causar icterícia (pele amarelada). Indica problemas no fígado ou nas vias biliares.',
        iconComponent: <FlaskIcon size="20" color="#8B5CF6" />,
        color: '#8B5CF6',
        bgColor: '#F5F3FF',
      },
    ],
    tips: [
      'Reduza o consumo de álcool',
      'Evite medicamentos sem prescrição médica',
      'Mantenha peso saudável para evitar esteatose',
      'Consuma alimentos ricos em antioxidantes',
      'Beba bastante água ao longo do dia',
      'Evite alimentos ultraprocessados',
    ],
    tipsTitle: 'Dicas para Saúde do Fígado',
    tipsBgColor: 'green.50',
    tipsTextColor: 'green',
  },
  rins: {
    sectionTitle: 'Entenda seus Rins',
    mainIcon: <RinIcon size="24" color="#3B82F6" />,
    mainColor: '#3B82F6',
    info: [
      {
        title: 'Função Renal',
        description:
          'Os rins filtram o sangue, removem toxinas, regulam a pressão arterial e mantêm o equilíbrio de eletrólitos.',
        iconComponent: <RinIcon size="20" color="#3B82F6" />,
        color: '#3B82F6',
        bgColor: '#EFF6FF',
      },
      {
        title: 'Creatinina',
        description:
          'Valores normais: 0,7-1,3 mg/dL (homens) e 0,6-1,1 mg/dL (mulheres). Níveis altos indicam função renal comprometida.',
        iconComponent: <FlaskIcon size="20" color="#F97316" />,
        color: '#F97316',
        bgColor: '#FFF7ED',
      },
      {
        title: 'Taxa de Filtração (TFG)',
        description:
          'Mede a eficiência dos rins. Valores acima de 90 são normais. Abaixo de 60 pode indicar doença renal crônica.',
        iconComponent: <ChartIcon size="20" color="#22C55E" />,
        color: '#22C55E',
        bgColor: '#F0FDF4',
      },
      {
        title: 'Hidratação',
        description:
          'A água é essencial para o funcionamento renal. Urina clara indica boa hidratação; escura pode indicar desidratação.',
        iconComponent: <WaterIcon size="20" color="#0EA5E9" />,
        color: '#0EA5E9',
        bgColor: '#F0F9FF',
      },
    ],
    tips: [
      'Beba pelo menos 2 litros de água por dia',
      'Controle a pressão arterial e diabetes',
      'Reduza o consumo de sal e proteínas em excesso',
      'Evite uso prolongado de anti-inflamatórios',
      'Faça exames de função renal regularmente',
      'Mantenha um peso saudável',
    ],
    tipsTitle: 'Dicas para Saúde Renal',
    tipsBgColor: 'blue.50',
    tipsTextColor: 'blue',
  },
  sangue: {
    sectionTitle: 'Entenda seu Sangue',
    mainIcon: <SanIcon size="24" color="#DC2626" />,
    mainColor: '#DC2626',
    info: [
      {
        title: 'Hemograma Completo',
        description:
          'Avalia glóbulos vermelhos, brancos e plaquetas. É fundamental para detectar anemias, infecções e distúrbios da coagulação.',
        iconComponent: <BloodDripIcon size="20" color="#DC2626" />,
        color: '#DC2626',
        bgColor: '#FEF2F2',
      },
      {
        title: 'Hemoglobina',
        description:
          'Transporta oxigênio no sangue. Valores normais: 12-16 g/dL (mulheres) e 14-18 g/dL (homens). Baixa indica anemia.',
        iconComponent: <SanIcon size="20" color="#F97316" />,
        color: '#F97316',
        bgColor: '#FFF7ED',
      },
      {
        title: 'Leucócitos (Glóbulos Brancos)',
        description:
          'Defendem o corpo contra infecções. Valores normais: 4.000-11.000/mm³. Alterações podem indicar infecção ou outras condições.',
        iconComponent: <ShieldIcon size="20" color="#22C55E" />,
        color: '#22C55E',
        bgColor: '#F0FDF4',
      },
      {
        title: 'Plaquetas',
        description:
          'Essenciais para coagulação. Valores normais: 150.000-400.000/mm³. Alterações afetam a capacidade de cicatrização.',
        iconComponent: <ChartIcon size="20" color="#8B5CF6" />,
        color: '#8B5CF6',
        bgColor: '#F5F3FF',
      },
    ],
    tips: [
      'Consuma alimentos ricos em ferro (carnes, folhas verdes)',
      'Vitamina C ajuda na absorção de ferro',
      'Faça exames de sangue periodicamente',
      'Mantenha hidratação adequada',
      'Evite automedicação que afete a coagulação',
      'Doe sangue regularmente se elegível',
    ],
    tipsTitle: 'Dicas para Saúde Sanguínea',
    tipsBgColor: 'red.50',
    tipsTextColor: 'red',
  },
  intestino: {
    sectionTitle: 'Entenda seu Intestino',
    mainIcon: <IntestineIcon size="24" color="#F97316" />,
    mainColor: '#F97316',
    info: [
      {
        title: 'Saúde Intestinal',
        description:
          'O intestino é responsável pela absorção de nutrientes e é considerado o "segundo cérebro" devido à sua conexão com o sistema nervoso.',
        iconComponent: <IntestineIcon size="20" color="#F97316" />,
        color: '#F97316',
        bgColor: '#FFF7ED',
      },
      {
        title: 'Microbiota Intestinal',
        description:
          'Trilhões de bactérias benéficas vivem no intestino. Um microbioma equilibrado é essencial para imunidade e digestão.',
        iconComponent: <VirusIcon size="20" color="#22C55E" />,
        color: '#22C55E',
        bgColor: '#F0FDF4',
      },
      {
        title: 'Trânsito Intestinal',
        description:
          'Evacuações regulares (1-3x ao dia) são saudáveis. Constipação ou diarreia frequentes merecem atenção médica.',
        iconComponent: <ChartIcon size="20" color="#3B82F6" />,
        color: '#3B82F6',
        bgColor: '#EFF6FF',
      },
      {
        title: 'Fibras na Alimentação',
        description:
          'Recomenda-se 25-30g de fibras por dia. Ajudam no trânsito intestinal e alimentam as bactérias benéficas.',
        iconComponent: <LeafIcon size="20" color="#16A34A" />,
        color: '#16A34A',
        bgColor: '#F0FDF4',
      },
    ],
    tips: [
      'Consuma fibras diariamente (frutas, verduras, grãos)',
      'Beba bastante água para auxiliar o trânsito',
      'Inclua probióticos na dieta (iogurte, kefir)',
      'Evite alimentos ultraprocessados',
      'Mastigue bem os alimentos',
      'Mantenha horários regulares para as refeições',
    ],
    tipsTitle: 'Dicas para Saúde Intestinal',
    tipsBgColor: 'orange.50',
    tipsTextColor: 'orange',
  },
  pâncreas: {
    sectionTitle: 'Entenda seu Pâncreas',
    mainIcon: <PanIcon size="24" color="#8B5CF6" />,
    mainColor: '#8B5CF6',
    info: [
      {
        title: 'Função Pancreática',
        description:
          'O pâncreas produz insulina para controlar glicose e enzimas digestivas. É vital para metabolismo e digestão.',
        iconComponent: <PanIcon size="20" color="#8B5CF6" />,
        color: '#8B5CF6',
        bgColor: '#F5F3FF',
      },
      {
        title: 'Glicemia em Jejum',
        description:
          'Valores normais: 70-99 mg/dL. Entre 100-125 indica pré-diabetes. Acima de 126 pode indicar diabetes.',
        iconComponent: <FlaskIcon size="20" color="#F97316" />,
        color: '#F97316',
        bgColor: '#FFF7ED',
      },
      {
        title: 'Hemoglobina Glicada (HbA1c)',
        description:
          'Mostra a média de glicose nos últimos 3 meses. Normal: abaixo de 5,7%. Acima de 6,5% indica diabetes.',
        iconComponent: <ChartIcon size="20" color="#DC2626" />,
        color: '#DC2626',
        bgColor: '#FEF2F2',
      },
      {
        title: 'Insulina',
        description:
          'Hormônio que permite às células absorverem glicose. Resistência à insulina é precursora do diabetes tipo 2.',
        iconComponent: <EnergyIcon size="20" color="#22C55E" />,
        color: '#22C55E',
        bgColor: '#F0FDF4',
      },
    ],
    tips: [
      'Reduza consumo de açúcares simples',
      'Prefira carboidratos complexos e integrais',
      'Pratique exercícios físicos regularmente',
      'Mantenha peso corporal saudável',
      'Evite bebidas açucaradas e ultraprocessados',
      'Monitore a glicemia se houver histórico familiar',
    ],
    tipsTitle: 'Dicas para Saúde Pancreática',
    tipsBgColor: 'purple.50',
    tipsTextColor: 'purple',
  },
  imunidade: {
    sectionTitle: 'Entenda sua Imunidade',
    mainIcon: <ImuIcon size="24" color="#0EA5E9" />,
    mainColor: '#0EA5E9',
    info: [
      {
        title: 'Sistema Imunológico',
        description:
          'Defende o corpo contra vírus, bactérias e outros invasores. Um sistema forte previne doenças e acelera recuperações.',
        iconComponent: <ShieldIcon size="20" color="#0EA5E9" />,
        color: '#0EA5E9',
        bgColor: '#F0F9FF',
      },
      {
        title: 'Leucócitos',
        description:
          'Glóbulos brancos são os soldados do sistema imune. Valores normais: 4.000-11.000/mm³. Alterações indicam resposta imune.',
        iconComponent: <ImuIcon size="20" color="#22C55E" />,
        color: '#22C55E',
        bgColor: '#F0FDF4',
      },
      {
        title: 'Inflamação',
        description:
          'PCR e VHS são marcadores de inflamação. Níveis elevados indicam que o corpo está combatendo algo.',
        iconComponent: <ThermometerIcon size="20" color="#F97316" />,
        color: '#F97316',
        bgColor: '#FFF7ED',
      },
      {
        title: 'Anticorpos',
        description:
          'Imunoglobulinas (IgA, IgG, IgM) são proteínas que combatem infecções específicas e guardam memória imunológica.',
        iconComponent: <FlaskIcon size="20" color="#8B5CF6" />,
        color: '#8B5CF6',
        bgColor: '#F5F3FF',
      },
    ],
    tips: [
      'Durma 7-9 horas por noite',
      'Consuma vitaminas C, D e zinco',
      'Pratique exercícios moderados regularmente',
      'Gerencie o estresse (afeta a imunidade)',
      'Mantenha vacinação em dia',
      'Evite tabagismo e excesso de álcool',
    ],
    tipsTitle: 'Dicas para Fortalecer a Imunidade',
    tipsBgColor: 'cyan.50',
    tipsTextColor: 'cyan',
  },
  urina: {
    sectionTitle: 'Entenda sua Urina',
    mainIcon: <UrinaIcon size="24" color="#EAB308" />,
    mainColor: '#EAB308',
    info: [
      {
        title: 'Exame de Urina',
        description:
          'Avalia cor, densidade, pH e presença de substâncias. É fundamental para detectar infecções, diabetes e problemas renais.',
        iconComponent: <UrinaIcon size="20" color="#EAB308" />,
        color: '#EAB308',
        bgColor: '#FEFCE8',
      },
      {
        title: 'Cor da Urina',
        description:
          'Amarelo claro indica boa hidratação. Muito escura pode indicar desidratação. Avermelhada requer atenção médica.',
        iconComponent: <WaterIcon size="20" color="#3B82F6" />,
        color: '#3B82F6',
        bgColor: '#EFF6FF',
      },
      {
        title: 'Presença de Proteínas',
        description:
          'Normalmente não há proteínas na urina. Sua presença pode indicar problemas renais ou outras condições.',
        iconComponent: <FlaskIcon size="20" color="#F97316" />,
        color: '#F97316',
        bgColor: '#FFF7ED',
      },
      {
        title: 'Infecção Urinária',
        description:
          'Leucócitos e bactérias na urina indicam infecção. Sintomas: ardência, urgência e frequência aumentada.',
        iconComponent: <WarningIcon size="20" color="#DC2626" />,
        color: '#DC2626',
        bgColor: '#FEF2F2',
      },
    ],
    tips: [
      'Beba água suficiente ao longo do dia',
      'Não segure a urina por longos períodos',
      'Mantenha boa higiene íntima',
      'Urine após relações sexuais (previne infecções)',
      'Evite roupas íntimas muito apertadas',
      'Faça exames de urina periodicamente',
    ],
    tipsTitle: 'Dicas para Saúde Urinária',
    tipsBgColor: 'yellow.50',
    tipsTextColor: 'yellow',
  },
  hormônios: {
    sectionTitle: 'Entenda seus Hormônios',
    mainIcon: <HormonioIcon size="24" color="#8B5CF6" />,
    mainColor: '#8B5CF6',
    info: [
      {
        title: 'Sistema Hormonal',
        description:
          'Hormônios são mensageiros químicos que regulam crescimento, metabolismo, humor e reprodução.',
        iconComponent: <HormonioIcon size="20" color="#8B5CF6" />,
        color: '#8B5CF6',
        bgColor: '#F5F3FF',
      },
      {
        title: 'Cortisol',
        description:
          'Hormônio do estresse. Níveis alterados podem causar fadiga, ganho de peso e alterações de humor.',
        iconComponent: <WarningIcon size="20" color="#F97316" />,
        color: '#F97316',
        bgColor: '#FFF7ED',
      },
      {
        title: 'Vitamina D',
        description:
          'Atua como hormônio no corpo. Deficiência pode causar fraqueza óssea, fadiga e baixa imunidade.',
        iconComponent: <EnergyIcon size="20" color="#EAB308" />,
        color: '#EAB308',
        bgColor: '#FEFCE8',
      },
      {
        title: 'Hormônios Sexuais',
        description:
          'Testosterona, estrogênio e progesterona regulam função reprodutiva, massa muscular e bem-estar.',
        iconComponent: <HeartIcon size="20" color="#EC4899" />,
        color: '#EC4899',
        bgColor: '#FDF2F8',
      },
    ],
    tips: [
      'Durma 7-9 horas por noite',
      'Gerencie o estresse com atividades relaxantes',
      'Mantenha alimentação equilibrada',
      'Pratique exercícios regularmente',
      'Tome sol pela manhã (vitamina D)',
      'Consulte um endocrinologista se necessário',
    ],
    tipsTitle: 'Dicas para Equilíbrio Hormonal',
    tipsBgColor: 'purple.50',
    tipsTextColor: 'purple',
  },
  tireóide: {
    sectionTitle: 'Entenda sua Tireóide',
    mainIcon: <TireoideIcon size="24" color="#0891B2" />,
    mainColor: '#0891B2',
    info: [
      {
        title: 'Função da Tireóide',
        description:
          'A tireóide produz hormônios T3 e T4 que regulam metabolismo, temperatura corporal e energia.',
        iconComponent: <TireoideIcon size="20" color="#0891B2" />,
        color: '#0891B2',
        bgColor: '#ECFEFF',
      },
      {
        title: 'TSH (Hormônio Estimulante)',
        description:
          'Valores normais: 0,4-4,0 mIU/L. Níveis alterados indicam hipotireoidismo ou hipertireoidismo.',
        iconComponent: <FlaskIcon size="20" color="#8B5CF6" />,
        color: '#8B5CF6',
        bgColor: '#F5F3FF',
      },
      {
        title: 'Hipotireoidismo',
        description:
          'Tireóide lenta causa fadiga, ganho de peso, pele seca e sensibilidade ao frio. TSH elevado.',
        iconComponent: <WarningIcon size="20" color="#F97316" />,
        color: '#F97316',
        bgColor: '#FFF7ED',
      },
      {
        title: 'Hipertireoidismo',
        description:
          'Tireóide acelerada causa perda de peso, ansiedade, tremores e palpitações. TSH baixo.',
        iconComponent: <EnergyIcon size="20" color="#DC2626" />,
        color: '#DC2626',
        bgColor: '#FEF2F2',
      },
    ],
    tips: [
      'Consuma iodo adequadamente (sal iodado, frutos do mar)',
      'Evite excesso de soja se tiver problemas na tireóide',
      'Faça exames de TSH anualmente',
      'Tome medicação no mesmo horário (se prescrita)',
      'Aguarde 30-60 min antes de comer (após medicação)',
      'Consulte um endocrinologista regularmente',
    ],
    tipsTitle: 'Dicas para Saúde da Tireóide',
    tipsBgColor: 'cyan.50',
    tipsTextColor: 'cyan',
  },
};

// Conteúdo padrão para sistemas não mapeados
const defaultSystemContent: SystemEducationalData = {
  sectionTitle: 'Informações sobre o Sistema',
  mainIcon: <FlaskIcon size="24" color="#6B7280" />,
  mainColor: '#6B7280',
  info: [
    {
      title: 'Exames de Rotina',
      description: 'Exames regulares ajudam a monitorar sua saúde e detectar problemas precocemente.',
      iconComponent: <FlaskIcon size="20" color="#6B7280" />,
      color: '#6B7280',
      bgColor: '#F9FAFB',
    },
    {
      title: 'Valores de Referência',
      description: 'Cada exame tem valores de referência que variam conforme idade, sexo e laboratório.',
      iconComponent: <ChartIcon size="20" color="#3B82F6" />,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
    },
    {
      title: 'Acompanhamento Médico',
      description: 'Sempre consulte um profissional de saúde para interpretação personalizada dos resultados.',
      iconComponent: <StethoscopeIcon size="20" color="#22C55E" />,
      color: '#22C55E',
      bgColor: '#F0FDF4',
    },
  ],
  tips: [
    'Faça check-ups regulares',
    'Mantenha um estilo de vida saudável',
    'Siga as orientações do seu médico',
    'Guarde o histórico dos seus exames',
  ],
  tipsTitle: 'Dicas Gerais de Saúde',
  tipsBgColor: 'gray.50',
  tipsTextColor: 'gray',
};

export function HeartScore() {
  const scrollRef = useRef<any>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { currentSystem, setCurrentSystem, homeData } = useHome();
  const { personalData } = useOnboarding();

  // Verifica se o gênero é feminino (aceita várias formas)
  const isFemale = useMemo(() => {
    if (!personalData) return false;
    const gender = (personalData as any).gender;
    if (!gender) return false;
    const genderLower = String(gender).toLowerCase();
    return genderLower === 'f' || genderLower === 'female' || genderLower === 'feminino';
  }, [personalData]);

  // Determina a imagem baseada no gênero do usuário (saúde boa)
  const genderImage = useMemo(() => {
    return isFemale ? VectorFemale : VectorMale;
  }, [isFemale]);

  // Determina a imagem baseada no gênero do usuário (em risco)
  const genderRiskImage = useMemo(() => {
    return isFemale ? VectorRiskFemale : VectorRiskMale;
  }, [isFemale]);

  // Determina a imagem baseada no gênero do usuário (alerta/atenção)
  const genderAlertImage = useMemo(() => {
    return isFemale ? AlertFemale : AlertMale;
  }, [isFemale]);

  useEffect(() => {
    return () => {
      setCurrentSystem(null);
    };
  }, []);

  // Obtém o conteúdo educacional baseado no sistema atual
  const educationalContent = useMemo(() => {
    if (!currentSystem?.sistema) return defaultSystemContent;
    const systemKey = currentSystem.sistema.toLowerCase();
    return systemEducationalContent[systemKey] || defaultSystemContent;
  }, [currentSystem?.sistema]);

  if (currentSystem) {
    return (
      <VStack testID="screen-heart-score" py={16}>
        <HeaderTitle
          title={`Score ${currentSystem.sistema}`}
          withBackButton={() => {
            navigation.navigate('healthWallet');
          }}
          badgeVariant={currentSystem.nivel as 'risco alto' | 'normal' | 'excelente'}
        />

        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
          <VStack flex={1} space={4} pt={2} pb={32}>
            <VStack flex={1} mx={6}>
              {/* Banner de status */}
              {currentSystem.nivel == 'excelente' ? (
                <Box bg="ciano.400" pl={4} borderRadius={12} shadow={2} overflow="hidden">
                  <HStack h={160}>
                    <VStack flex={1} justifyContent="center" py={4}>
                      <Text fontSize={18} fontWeight={800} letterSpacing={-0.16} color="white" lineHeight={22}>
                        Woooow! {'\n'}Sua saúde está Top!
                      </Text>
                      <Text fontSize={14} fontWeight={500} letterSpacing={-0.16} color="white" mt={1}>
                        Continue mantendo o bom resultado!
                      </Text>
                    </VStack>

                    <Image
                      flex={1}
                      h={160}
                      source={genderImage}
                      defaultSource={genderImage}
                      alt="Vetor"
                      resizeMode="cover"
                    />
                  </HStack>
                </Box>
              ) : currentSystem.nivel == 'normal' ? (
                <Box bg="#FFD099" pl={4} borderRadius={12} shadow={2} overflow="hidden">
                  <HStack h={160}>
                    <VStack flex={1} justifyContent="center" py={4}>
                      <Text fontSize={18} fontWeight={800} letterSpacing={-0.16} color="#C06702" lineHeight={22}>
                        Sua saúde{'\n'}precisa de atenção!
                      </Text>
                      <Text fontSize={14} fontWeight={500} letterSpacing={-0.16} color="#3D4966" mt={1}>
                        Alguns indicadores estão{'\n'}fora do normal
                      </Text>
                    </VStack>

                    <Image
                      flex={1}
                      h={160}
                      source={genderAlertImage}
                      defaultSource={genderAlertImage}
                      alt="Alerta"
                      resizeMode="contain"
                    />
                  </HStack>
                </Box>
              ) : (
                <Box bg="red.400" pl={4} borderRadius={12} shadow={2} overflow="hidden">
                  <HStack h={160}>
                    <VStack flex={1} justifyContent="center" py={4}>
                      <Text fontSize={18} fontWeight={800} letterSpacing={-0.16} color="white" lineHeight={22}>
                        Sua saúde{'\n'}está em risco!
                      </Text>
                      <Text fontSize={14} fontWeight={500} letterSpacing={-0.16} color="white" mt={2}>
                        Alguns indicadores precisam de atenção urgente.
                      </Text>
                    </VStack>

                    <Image
                      flex={1}
                      h={160}
                      source={genderRiskImage}
                      defaultSource={genderRiskImage}
                      alt="Vetor"
                      resizeMode="cover"
                    />
                  </HStack>
                </Box>
              )}
            </VStack>

            {/* 1. Resumo Personalizado do Sistema */}
            {currentSystem && homeData?.medicalExamItems && (
              <VStack mx={6}>
                <SystemInsights homeData={homeData} currentSystem={currentSystem} />
              </VStack>
            )}

            {/* Botão Ver Exames - abaixo do resumo, acima das dicas */}
            <VStack mx={6}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('examList')}>
                <Box
                  mt={4}
                  bg="ciano.300"
                  py={3}
                  px={5}
                  borderRadius={12}
                  flexDir="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box mr={3}>
                    <ChecklistIcon color="white" size="24" />
                  </Box>
                  <Text fontSize={16} fontWeight={700} color="white" letterSpacing={-0.16}>
                    Ver Todos os Exames
                  </Text>
                </Box>
              </TouchableOpacity>
            </VStack>

            {/* 2. Carrossel de Notícias de Saúde - Filtrado pelo sistema atual */}
            <NewsCarousel title={`Dicas para ${currentSystem?.sistema}`} system={currentSystem?.sistema} />

            <VStack flex={1} mx={6}>
              {/* 3. Título de serviços */}
              <Text mt={5} mb={2} fontSize={18} fontWeight={700} letterSpacing={-0.18} color="gray.900">
                Serviços Disponíveis
              </Text>

              {/* Cards de serviços */}
              <HStack justifyContent={'space-between'} space={4}>
                <Box mt={2} bg={'white'} p={4} shadow={1} borderRadius={16} minH={180} flex={1} position="relative">
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0,0,0,0.4)"
                    borderRadius={16}
                    alignItems="center"
                    justifyContent="center"
                    zIndex={10}
                  >
                    <Text fontSize={18} fontWeight={700} color="white" textAlign="center">
                      Em breve
                    </Text>
                  </Box>

                  <HStack justifyContent="space-between">
                    <Box bg="gray.50" borderRadius={16} size={12} alignItems="center" justifyContent="center">
                      <StethoscopeIcon />
                    </Box>
                    <ChevronRightIcon color="#0CC1AF" size="32" />
                  </HStack>

                  <Text mt={1} fontSize={18} fontWeight={500} letterSpacing={-0.16} lineHeight={22}>
                    Agendar Consulta
                  </Text>

                  <Text mt={1} fontSize={13} fontWeight={400} letterSpacing={-0.16} color="gray.600">
                    Fale com um de nossos especialistas!
                  </Text>
                </Box>

                <Box mt={2} bg={'white'} p={4} shadow={1} borderRadius={16} minH={180} flex={1} position="relative">
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0,0,0,0.4)"
                    borderRadius={16}
                    alignItems="center"
                    justifyContent="center"
                    zIndex={10}
                  >
                    <Text fontSize={18} fontWeight={700} color="white" textAlign="center">
                      Em breve
                    </Text>
                  </Box>

                  <HStack justifyContent="space-between">
                    <Box bg="gray.50" borderRadius={16} size={12} alignItems="center" justifyContent="center">
                      <BarbellIcon />
                    </Box>
                    <ChevronRightIcon color="#0CC1AF" size="32" />
                  </HStack>

                  <Text mt={1} fontSize={18} fontWeight={500} letterSpacing={-0.16} lineHeight={22}>
                    Programa Fitness
                  </Text>

                  <Text mt={1} fontSize={13} fontWeight={400} letterSpacing={-0.16} color="gray.600">
                    Fique em forma e melhore sua saúde!
                  </Text>
                </Box>
              </HStack>

              <HStack justifyContent={'space-between'} space={4}>
                <Box mt={3} bg={'white'} p={4} shadow={1} borderRadius={16} minH={180} flex={1} position="relative">
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0,0,0,0.4)"
                    borderRadius={16}
                    alignItems="center"
                    justifyContent="center"
                    zIndex={10}
                  >
                    <Text fontSize={18} fontWeight={700} color="white" textAlign="center">
                      Em breve
                    </Text>
                  </Box>

                  <HStack justifyContent="space-between">
                    <Box bg="gray.50" borderRadius={16} size={12} alignItems="center" justifyContent="center">
                      <HeadHealtthIcon />
                    </Box>
                    <ChevronRightIcon color="#0CC1AF" size="32" />
                  </HStack>

                  <Text mt={1} fontSize={18} fontWeight={500} letterSpacing={-0.16} lineHeight={22}>
                    Terapia Online
                  </Text>

                  <Text mt={1} fontSize={13} fontWeight={400} letterSpacing={-0.16} color="gray.600">
                    Cuide da sua saúde mental! Fale com nossa Terapeuta!
                  </Text>
                </Box>

                <Box mt={3} bg={'white'} p={4} shadow={1} borderRadius={16} minH={180} flex={1} position="relative">
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0,0,0,0.4)"
                    borderRadius={16}
                    alignItems="center"
                    justifyContent="center"
                    zIndex={10}
                  >
                    <Text fontSize={18} fontWeight={700} color="white" textAlign="center">
                      Em breve
                    </Text>
                  </Box>

                  <HStack justifyContent="space-between">
                    <Box bg="gray.50" borderRadius={16} size={12} alignItems="center" justifyContent="center">
                      <PillIcon />
                    </Box>
                    <ChevronRightIcon color="#0CC1AF" size="32" />
                  </HStack>

                  <Text mt={1} fontSize={18} fontWeight={500} letterSpacing={-0.16} lineHeight={22}>
                    Farmácia de Manipulação
                  </Text>

                  <Text mt={1} fontSize={13} fontWeight={400} letterSpacing={-0.16} color="gray.600">
                    Aqui você tem 20% de desconto em qualquer remédio manipulado.
                  </Text>
                </Box>
              </HStack>

              {/* 5. Aviso importante - no final */}
              <Box mt={5} bg="yellow.50" px={3} py={2.5} borderRadius={12} borderWidth={1} borderColor="yellow.200">
                <HStack alignItems="flex-start" space={2}>
                  <WarningIcon size="16" color="#EAB308" />
                  <VStack flex={1}>
                    <Text fontSize={12} fontWeight={600} color="yellow.800">
                      Importante
                    </Text>
                    <Text fontSize={12} fontWeight={500} color="yellow.700" lineHeight={14}>
                      Estas informações são educativas e não substituem consulta médica.
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </VStack>
          </VStack>
        </ScrollView>
      </VStack>
    );
  }
}
