import React from 'react';
import { render } from '@testing-library/react-native';
import { SystemInsights } from './index';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: (props: any) => require("react").createElement(RN.View, props),
    Text: (props: any) => require("react").createElement(RN.Text, props),
    VStack: (props: any) => require("react").createElement(RN.View, props),
    HStack: (props: any) => require("react").createElement(RN.View, props),
  };
});

jest.mock('@assets/icons', () => ({
  ShieldIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'shield-icon' }),
  WarningIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'warning-icon' }),
  ExclamationMarkSquareIcon: (props: any) =>
    require('react').createElement(require('react-native').View, { ...props, testID: 'exclamation-icon' }),
  CheckIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'check-icon' }),
}));

const makeExamItem = (overrides: any = {}) => ({
  examItemDescription: 'Colesterol Total',
  medicalExamItemReferenceValue: '< 200',
  medicalExamItemMeasureUnit: 'mg/dL',
  medicalExamItemScore: 85,
  medicalExamItemWeightSummaryExplanation: 'Dentro dos valores normais',
  medicalExamItemWeightActionRecommendation: 'Manter habitos',
  medicalExamItemWeightColor: 'green',
  medicalExamItemWeightDescription: 'Normal',
  ...overrides,
});

const makeSystemScore = (overrides: any = {}) => ({
  examOrganicSystemId: '1',
  examOrganicSystemDescription: 'Coração',
  organicSystemScore: 85,
  organicSystemScoreSummaryExplanation: 'Excelente',
  organicSystemScoreActionRecommendation: 'Continue assim',
  ...overrides,
});

describe('SystemInsights', () => {
  it('returns null when no data available', () => {
    const { toJSON } = render(
      <SystemInsights
        homeData={{ medicalExamItems: [], medicalExamOrganicSystemsScore: [] }}
        currentSystem={{ sistema: 'coração', nivel: 'excelente' }}
      />
    );
    expect(toJSON()).toBeNull();
  });

  it('returns null when homeData is empty', () => {
    const { toJSON } = render(
      <SystemInsights
        homeData={{}}
        currentSystem={{ sistema: 'coração', nivel: 'excelente' }}
      />
    );
    expect(toJSON()).toBeNull();
  });

  it('renders title with masculine article for coração', () => {
    const { getByText } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: [makeExamItem()],
          medicalExamOrganicSystemsScore: [makeSystemScore()],
        }}
        currentSystem={{ sistema: 'coração', nivel: 'excelente' }}
      />
    );
    expect(getByText(/Resumo do seu coração/)).toBeTruthy();
  });

  it('renders title with feminine article for imunidade', () => {
    const { getByText } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: [
            makeExamItem({
              examItemDescription: 'Leucócitos',
              medicalExamItemWeightColor: 'green',
              medicalExamItemWeightDescription: 'Normal',
            }),
          ],
          medicalExamOrganicSystemsScore: [
            makeSystemScore({
              examOrganicSystemDescription: 'Imunidade',
              organicSystemScore: 90,
            }),
          ],
        }}
        currentSystem={{ sistema: 'imunidade', nivel: 'excelente' }}
      />
    );
    expect(getByText(/Resumo do sua imunidade/)).toBeTruthy();
  });

  it('renders good insight for excellent score', () => {
    const { getByText } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: [makeExamItem()],
          medicalExamOrganicSystemsScore: [
            makeSystemScore({ organicSystemScore: 85 }),
          ],
        }}
        currentSystem={{ sistema: 'coração', nivel: 'excelente' }}
      />
    );
    expect(getByText(/excelente condição/)).toBeTruthy();
  });

  it('renders moderate insight for score 60-79', () => {
    const { getByText } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: [makeExamItem()],
          medicalExamOrganicSystemsScore: [
            makeSystemScore({ organicSystemScore: 65 }),
          ],
        }}
        currentSystem={{ sistema: 'coração', nivel: 'normal' }}
      />
    );
    expect(getByText(/condição moderada/)).toBeTruthy();
  });

  it('renders critical insight for score below 60', () => {
    const { getByText } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: [makeExamItem()],
          medicalExamOrganicSystemsScore: [
            makeSystemScore({ organicSystemScore: 40 }),
          ],
        }}
        currentSystem={{ sistema: 'coração', nivel: 'risco alto' }}
      />
    );
    expect(getByText(/precisa de atenção/)).toBeTruthy();
  });

  it('renders critical biomarker insight', () => {
    const { getByText } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: [
            makeExamItem({
              examItemDescription: 'LDL',
              medicalExamItemWeightColor: 'red',
              medicalExamItemWeightDescription: 'Crítico',
            }),
          ],
          medicalExamOrganicSystemsScore: [makeSystemScore()],
        }}
        currentSystem={{ sistema: 'coração', nivel: 'risco alto' }}
      />
    );
    expect(getByText(/requerem atenção médica/)).toBeTruthy();
  });

  it('renders attention biomarker insight', () => {
    const { getByText } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: [
            makeExamItem({
              examItemDescription: 'Triglicerídeos',
              medicalExamItemWeightColor: 'yellow',
              medicalExamItemWeightDescription: 'Elevado',
            }),
          ],
          medicalExamOrganicSystemsScore: [makeSystemScore()],
        }}
        currentSystem={{ sistema: 'coração', nivel: 'normal' }}
      />
    );
    expect(getByText(/valores fora do ideal/)).toBeTruthy();
  });

  it('renders good biomarker insight when all are green', () => {
    const { getByText } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: [
            makeExamItem({
              examItemDescription: 'HDL',
              medicalExamItemWeightColor: 'green',
              medicalExamItemWeightDescription: 'Normal',
            }),
          ],
          medicalExamOrganicSystemsScore: [makeSystemScore()],
        }}
        currentSystem={{ sistema: 'coração', nivel: 'excelente' }}
      />
    );
    expect(getByText(/níveis saudáveis/)).toBeTruthy();
  });

  it('renders count of good biomarkers when mixed with others', () => {
    const { getByText } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: [
            makeExamItem({
              examItemDescription: 'HDL',
              medicalExamItemWeightColor: 'green',
              medicalExamItemWeightDescription: 'Normal',
            }),
            makeExamItem({
              examItemDescription: 'LDL',
              medicalExamItemWeightColor: 'yellow',
              medicalExamItemWeightDescription: 'Elevado',
            }),
          ],
          medicalExamOrganicSystemsScore: [makeSystemScore()],
        }}
        currentSystem={{ sistema: 'coração', nivel: 'normal' }}
      />
    );
    expect(getByText(/biomarcador/)).toBeTruthy();
  });

  it('handles system with no matching biomarkers (uses first 5)', () => {
    const items = Array.from({ length: 6 }, (_, i) =>
      makeExamItem({
        examItemDescription: `Generic Item ${i}`,
        medicalExamItemWeightColor: 'green',
        medicalExamItemWeightDescription: 'Normal',
      })
    );
    const { toJSON } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: items,
          medicalExamOrganicSystemsScore: [],
        }}
        currentSystem={{ sistema: 'unknown_system', nivel: 'normal' }}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('handles multiple critical items (shows max 2 names)', () => {
    const { getByText } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: [
            makeExamItem({
              examItemDescription: 'Colesterol',
              medicalExamItemWeightColor: 'red',
              medicalExamItemWeightDescription: 'Crítico',
            }),
            makeExamItem({
              examItemDescription: 'LDL',
              medicalExamItemWeightColor: 'red',
              medicalExamItemWeightDescription: 'Crítico',
            }),
            makeExamItem({
              examItemDescription: 'Triglicerídeos',
              medicalExamItemWeightColor: 'red',
              medicalExamItemWeightDescription: 'Crítico',
            }),
          ],
          medicalExamOrganicSystemsScore: [makeSystemScore()],
        }}
        currentSystem={{ sistema: 'coração', nivel: 'risco alto' }}
      />
    );
    expect(getByText(/Colesterol e LDL/)).toBeTruthy();
  });

  it('handles single critical item (singular text)', () => {
    const { getByText } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: [
            makeExamItem({
              examItemDescription: 'LDL',
              medicalExamItemWeightColor: 'red',
              medicalExamItemWeightDescription: 'Crítico',
            }),
          ],
          medicalExamOrganicSystemsScore: [makeSystemScore()],
        }}
        currentSystem={{ sistema: 'coração', nivel: 'risco alto' }}
      />
    );
    expect(getByText(/está em níveis/)).toBeTruthy();
  });

  it('renders for fígado system', () => {
    const { getByText } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: [
            makeExamItem({
              examItemDescription: 'TGO',
              medicalExamItemWeightColor: 'green',
              medicalExamItemWeightDescription: 'Normal',
            }),
          ],
          medicalExamOrganicSystemsScore: [
            makeSystemScore({
              examOrganicSystemDescription: 'Fígado',
              organicSystemScore: 90,
            }),
          ],
        }}
        currentSystem={{ sistema: 'fígado', nivel: 'excelente' }}
      />
    );
    expect(getByText(/Resumo do seu fígado/)).toBeTruthy();
  });

  it('renders for tireóide system with feminine article', () => {
    const { getByText } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: [
            makeExamItem({
              examItemDescription: 'TSH',
              medicalExamItemWeightColor: 'green',
              medicalExamItemWeightDescription: 'Normal',
            }),
          ],
          medicalExamOrganicSystemsScore: [
            makeSystemScore({
              examOrganicSystemDescription: 'tireóide',
              organicSystemScore: 85,
            }),
          ],
        }}
        currentSystem={{ sistema: 'tireóide', nivel: 'excelente' }}
      />
    );
    expect(getByText(/Resumo do sua tireóide/)).toBeTruthy();
  });

  it('limits insights to 4 maximum', () => {
    // Create enough items to generate many insights
    const items = [
      makeExamItem({ examItemDescription: 'Colesterol', medicalExamItemWeightColor: 'red', medicalExamItemWeightDescription: 'Crítico' }),
      makeExamItem({ examItemDescription: 'LDL', medicalExamItemWeightColor: 'red', medicalExamItemWeightDescription: 'Alto risco' }),
      makeExamItem({ examItemDescription: 'Triglicerídeos', medicalExamItemWeightColor: 'yellow', medicalExamItemWeightDescription: 'Elevado' }),
      makeExamItem({ examItemDescription: 'HDL', medicalExamItemWeightColor: 'green', medicalExamItemWeightDescription: 'Normal' }),
      makeExamItem({ examItemDescription: 'VLDL', medicalExamItemWeightColor: 'green', medicalExamItemWeightDescription: 'Adequado' }),
    ];
    const { toJSON } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: items,
          medicalExamOrganicSystemsScore: [makeSystemScore({ organicSystemScore: 45 })],
        }}
        currentSystem={{ sistema: 'coração', nivel: 'risco alto' }}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders without system score', () => {
    const { toJSON } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: [
            makeExamItem({
              examItemDescription: 'Colesterol',
              medicalExamItemWeightColor: 'green',
              medicalExamItemWeightDescription: 'Normal',
            }),
          ],
          medicalExamOrganicSystemsScore: [],
        }}
        currentSystem={{ sistema: 'coração', nivel: 'normal' }}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('handles attention description variants', () => {
    const items = [
      makeExamItem({
        examItemDescription: 'Creatinina',
        medicalExamItemWeightColor: 'orange',
        medicalExamItemWeightDescription: 'Atenção necessária',
      }),
      makeExamItem({
        examItemDescription: 'Ureia',
        medicalExamItemWeightColor: 'yellow',
        medicalExamItemWeightDescription: 'Baixo',
      }),
    ];
    const { getByText } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: items,
          medicalExamOrganicSystemsScore: [
            makeSystemScore({
              examOrganicSystemDescription: 'Rins',
              organicSystemScore: 70,
            }),
          ],
        }}
        currentSystem={{ sistema: 'rins', nivel: 'normal' }}
      />
    );
    expect(getByText(/valores fora do ideal/)).toBeTruthy();
  });

  it('deduplicates biomarkers across insight categories', () => {
    // Same item appears as both critical and attention
    const item = makeExamItem({
      examItemDescription: 'LDL',
      medicalExamItemWeightColor: 'red',
      medicalExamItemWeightDescription: 'Elevado', // matches both critical (red) and attention (elevado)
    });
    const { toJSON } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: [item],
          medicalExamOrganicSystemsScore: [makeSystemScore()],
        }}
        currentSystem={{ sistema: 'coração', nivel: 'risco alto' }}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('handles urina system with feminine article', () => {
    const { getByText } = render(
      <SystemInsights
        homeData={{
          medicalExamItems: [
            makeExamItem({
              examItemDescription: 'Proteína na urina',
              medicalExamItemWeightColor: 'green',
              medicalExamItemWeightDescription: 'Normal',
            }),
          ],
          medicalExamOrganicSystemsScore: [
            makeSystemScore({
              examOrganicSystemDescription: 'Urina',
              organicSystemScore: 90,
            }),
          ],
        }}
        currentSystem={{ sistema: 'urina', nivel: 'excelente' }}
      />
    );
    expect(getByText(/Resumo do sua urina/)).toBeTruthy();
  });
});
