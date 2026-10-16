import { ORGAN_TIPS, getOrganTips, OrganTip } from './organTips';

// Sistemas exibidos na Carteira de Saúde (healthWallet.tsx)
const SYSTEMS = ['sangue', 'coracao', 'figado', 'rins', 'pancreas', 'intestino', 'imunidade', 'urina', 'hormonios', 'tireoide'];

// Só fontes oficiais / sociedades médicas
const TRUSTED_HOSTS = [
  'www.gov.br',
  'bvsms.saude.gov.br',
  'www.sbn.org.br',
  'portaldaurologia.org.br',
  'www.endocrino.org.br',
];

const allTips: OrganTip[] = Object.values(ORGAN_TIPS).flat();

describe('organTips', () => {
  it.each(SYSTEMS)('"%s" tem pelo menos 2 dicas', (system) => {
    expect(ORGAN_TIPS[system]?.length).toBeGreaterThanOrEqual(2);
  });

  it('todas as dicas têm campos preenchidos', () => {
    allTips.forEach((tip) => {
      expect(tip.id).toBeTruthy();
      expect(tip.title.trim()).toBeTruthy();
      expect(tip.description.trim()).toBeTruthy();
      expect(tip.source.trim()).toBeTruthy();
    });
  });

  it('ids são únicos (usados como key no carrossel)', () => {
    const ids = allTips.map((tip) => tip.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('links são HTTPS e de fontes confiáveis', () => {
    allTips.forEach((tip) => {
      const url = new URL(tip.url);
      expect(url.protocol).toBe('https:');
      expect(TRUSTED_HOSTS).toContain(url.host);
    });
  });

  describe('getOrganTips', () => {
    it('aceita o nome vindo do backend com acento e caixa diferentes', () => {
      expect(getOrganTips('Tireóide')).toBe(ORGAN_TIPS.tireoide);
      expect(getOrganTips('Pâncreas')).toBe(ORGAN_TIPS.pancreas);
      expect(getOrganTips('  SANGUE ')).toBe(ORGAN_TIPS.sangue);
    });

    it('sistema desconhecido ou vazio retorna lista vazia', () => {
      expect(getOrganTips('baço')).toEqual([]);
      expect(getOrganTips(undefined)).toEqual([]);
    });
  });
});
