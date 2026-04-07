import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import ErrorBoundary from './ErrorBoundary';

// Componente que lança erro
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Erro de teste');
  }
  return <Text>Conteúdo normal</Text>;
};

describe('ErrorBoundary', () => {
  // Suprimir console.error do React durante os testes de erro
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar children quando não há erro', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(getByText('Conteúdo normal')).toBeTruthy();
  });

  it('deve mostrar tela de erro quando componente lança exceção', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Algo deu errado')).toBeTruthy();
    expect(getByText(/erro inesperado/i)).toBeTruthy();
    expect(getByText('Tentar Novamente')).toBeTruthy();
  });

  it('deve chamar console.error quando componente lança exceção', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });

  it('deve resetar ao clicar em Tentar Novamente', () => {
    let shouldThrow = true;

    const ToggleError = () => {
      if (shouldThrow) throw new Error('Erro');
      return <Text>Recuperado</Text>;
    };

    const { getByText } = render(
      <ErrorBoundary>
        <ToggleError />
      </ErrorBoundary>
    );

    expect(getByText('Algo deu errado')).toBeTruthy();

    // Simular que o erro foi corrigido antes de resetar
    shouldThrow = false;

    fireEvent.press(getByText('Tentar Novamente'));

    expect(getByText('Recuperado')).toBeTruthy();
  });
});
