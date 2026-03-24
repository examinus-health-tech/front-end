import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { useTabBar } from './useTabBar';
import { TabBarContext } from '@contexts/TabBarContext';

describe('useTabBar', () => {
  const mockHideTabBar = jest.fn();
  const mockShowTabBar = jest.fn();

  const mockContextValue = {
    isTabBarVisible: true,
    hideTabBar: mockHideTabBar,
    showTabBar: mockShowTabBar,
  };

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      TabBarContext.Provider,
      { value: mockContextValue },
      children
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('quando usado dentro do TabBarContextProvider', () => {
    it('deve retornar o contexto do TabBar', () => {
      const { result } = renderHook(() => useTabBar(), { wrapper });

      expect(result.current).toBe(mockContextValue);
    });

    it('deve retornar isTabBarVisible como true', () => {
      const { result } = renderHook(() => useTabBar(), { wrapper });

      expect(result.current.isTabBarVisible).toBe(true);
    });

    it('deve retornar isTabBarVisible como false quando tab bar esta oculto', () => {
      const hiddenContext = {
        ...mockContextValue,
        isTabBarVisible: false,
      };

      const hiddenWrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(
          TabBarContext.Provider,
          { value: hiddenContext },
          children
        );

      const { result } = renderHook(() => useTabBar(), { wrapper: hiddenWrapper });

      expect(result.current.isTabBarVisible).toBe(false);
    });

    it('deve retornar funcao hideTabBar', () => {
      const { result } = renderHook(() => useTabBar(), { wrapper });

      expect(typeof result.current.hideTabBar).toBe('function');
    });

    it('deve retornar funcao showTabBar', () => {
      const { result } = renderHook(() => useTabBar(), { wrapper });

      expect(typeof result.current.showTabBar).toBe('function');
    });

    it('deve chamar hideTabBar corretamente', () => {
      const { result } = renderHook(() => useTabBar(), { wrapper });

      result.current.hideTabBar();

      expect(mockHideTabBar).toHaveBeenCalledTimes(1);
    });

    it('deve chamar showTabBar corretamente', () => {
      const { result } = renderHook(() => useTabBar(), { wrapper });

      result.current.showTabBar();

      expect(mockShowTabBar).toHaveBeenCalledTimes(1);
    });
  });

  describe('quando usado fora do TabBarContextProvider', () => {
    it('deve retornar contexto padrao vazio quando usado fora do TabBarContextProvider', () => {
      // O TabBarContext e criado com {} como valor padrao, entao nao lanca erro
      // mas retorna um objeto vazio sem as propriedades esperadas
      const { result } = renderHook(() => useTabBar());

      expect(result.current).toBeDefined();
      expect(result.current.isTabBarVisible).toBeUndefined();
    });
  });
});
