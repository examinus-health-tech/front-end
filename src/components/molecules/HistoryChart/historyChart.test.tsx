import React from 'react';
import { render } from '@testing-library/react-native';
import { HistoryChart } from './historyChart';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: (props: any) => require("react").createElement(RN.View, props),
    Text: (props: any) => require("react").createElement(RN.Text, props),
    HStack: (props: any) => require("react").createElement(RN.View, props),
    Box: (props: any) => require("react").createElement(RN.View, props),
  };
});

jest.mock('react-native-gifted-charts', () => ({
  LineChart: (props: any) => require('react').createElement(require('react-native').View, { testID: 'line-chart' }),
}));

const makeHistoryData = (values: number[]) =>
  values.map((value, index) => ({
    value,
    date: `0${index + 1}/01/2025`,
    label: `Jan ${index + 1}`,
    dataPointText: `${value}`,
  }));

describe('HistoryChart', () => {
  const defaultProps = {
    examItemDescription: 'Hemoglobina',
    historyData: makeHistoryData([14.5, 15.0, 14.8]),
    unit: 'g/dL',
  };

  it('renders empty state when historyData is empty', () => {
    const { getByText } = render(
      <HistoryChart
        examItemDescription="Hemoglobina"
        historyData={[]}
        unit="g/dL"
      />
    );
    expect(getByText(/Nenhum dado disponível/)).toBeTruthy();
  });

  it('renders empty state when historyData is undefined-like', () => {
    const { getByText } = render(
      <HistoryChart
        examItemDescription="Hemoglobina"
        historyData={undefined as any}
        unit="g/dL"
      />
    );
    expect(getByText(/Nenhum dado disponível/)).toBeTruthy();
  });

  it('renders single data point message', () => {
    const singleData = makeHistoryData([14.5]);
    const { getByText } = render(
      <HistoryChart
        examItemDescription="Hemoglobina"
        historyData={singleData}
        unit="g/dL"
      />
    );
    expect(getByText(/pelo menos 2 exames/)).toBeTruthy();
    expect(getByText(/14.5 g\/dL/)).toBeTruthy();
    expect(getByText('01/01/2025')).toBeTruthy();
  });

  it('renders chart with multiple data points', () => {
    const { getByText, getByTestId } = render(
      <HistoryChart {...defaultProps} />
    );
    expect(getByText('Hemoglobina')).toBeTruthy();
    expect(getByText('Seus valores')).toBeTruthy();
    expect(getByTestId('line-chart')).toBeTruthy();
  });

  it('renders date range for multi-point data', () => {
    const { getByText } = render(<HistoryChart {...defaultProps} />);
    expect(getByText('Primeiro registro')).toBeTruthy();
    expect(getByText('Ultimo registro')).toBeTruthy();
    expect(getByText('01/01/2025')).toBeTruthy();
    expect(getByText('03/01/2025')).toBeTruthy();
  });

  it('shows "Aumento" when last value > first value', () => {
    const data = makeHistoryData([10, 20]);
    const { getByText } = render(
      <HistoryChart examItemDescription="Teste" historyData={data} unit="u" />
    );
    expect(getByText('Aumento')).toBeTruthy();
  });

  it('shows "Reducao" when last value < first value', () => {
    const data = makeHistoryData([20, 10]);
    const { getByText } = render(
      <HistoryChart examItemDescription="Teste" historyData={data} unit="u" />
    );
    expect(getByText('Redução')).toBeTruthy();
  });

  it('shows "Estavel" when values are equal', () => {
    const data = makeHistoryData([15, 15]);
    const { getByText } = render(
      <HistoryChart examItemDescription="Teste" historyData={data} unit="u" />
    );
    expect(getByText('Estável')).toBeTruthy();
  });

  it('renders reference legend when referenceMin is provided', () => {
    const { getByText } = render(
      <HistoryChart {...defaultProps} referenceMin={12} />
    );
    expect(getByText('Referencia')).toBeTruthy();
  });

  it('renders reference legend when referenceMax is provided', () => {
    const { getByText } = render(
      <HistoryChart {...defaultProps} referenceMax={17} />
    );
    expect(getByText('Referencia')).toBeTruthy();
  });

  it('does not render reference legend when no reference values', () => {
    const { queryByText } = render(<HistoryChart {...defaultProps} />);
    expect(queryByText('Referencia')).toBeNull();
  });

  it('uses custom color', () => {
    const { getByTestId } = render(
      <HistoryChart {...defaultProps} color="#FF0000" />
    );
    expect(getByTestId('line-chart')).toBeTruthy();
  });

  it('handles large numbers in formatCompactNumber', () => {
    const data = [
      { value: 1500000, date: '01/01/2025', label: 'Jan', dataPointText: '1.5M' },
      { value: 2000000, date: '02/01/2025', label: 'Feb', dataPointText: '2M' },
    ];
    const { getByText } = render(
      <HistoryChart examItemDescription="Test" historyData={data} unit="u" />
    );
    expect(getByText('Test')).toBeTruthy();
  });

  it('handles values between 10000 and 1000000', () => {
    const data = makeHistoryData([12345, 54321]);
    const { getByText } = render(
      <HistoryChart examItemDescription="Test" historyData={data} unit="u" />
    );
    expect(getByText('Test')).toBeTruthy();
  });

  it('handles values between 1000 and 10000', () => {
    const data = makeHistoryData([1500, 2500]);
    const { getByText } = render(
      <HistoryChart examItemDescription="Test" historyData={data} unit="u" />
    );
    expect(getByText('Test')).toBeTruthy();
  });

  it('handles integer values', () => {
    const data = makeHistoryData([100, 200]);
    const { getByText } = render(
      <HistoryChart examItemDescription="Test" historyData={data} unit="u" />
    );
    expect(getByText('Test')).toBeTruthy();
  });

  it('handles decimal values', () => {
    const data = makeHistoryData([1.5, 2.7]);
    const { getByText } = render(
      <HistoryChart examItemDescription="Test" historyData={data} unit="u" />
    );
    expect(getByText('Test')).toBeTruthy();
  });

  it('handles equal min and max values', () => {
    const data = makeHistoryData([50, 50]);
    const { getByText } = render(
      <HistoryChart examItemDescription="Test" historyData={data} unit="u" />
    );
    expect(getByText('Estável')).toBeTruthy();
  });

  it('includes reference values in range calculation', () => {
    const data = makeHistoryData([10, 20]);
    const { getByText } = render(
      <HistoryChart
        examItemDescription="Test"
        historyData={data}
        unit="u"
        referenceMin={5}
        referenceMax={30}
      />
    );
    expect(getByText('Test')).toBeTruthy();
  });
});
