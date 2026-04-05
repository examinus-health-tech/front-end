import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { TabBarContext, TabBarContextProvider } from './TabBarContext';
import { useContext } from 'react';

function useTabBarContext() {
  return useContext(TabBarContext);
}

describe('TabBarContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TabBarContextProvider>{children}</TabBarContextProvider>
  );

  describe('Estado inicial', () => {
    it('deve iniciar com a tab bar visivel', () => {
      const { result } = renderHook(() => useTabBarContext(), { wrapper });
      expect(result.current.isTabBarVisible).toBe(true);
    });

    it('deve fornecer as funcoes hideTabBar e showTabBar', () => {
      const { result } = renderHook(() => useTabBarContext(), { wrapper });
      expect(typeof result.current.hideTabBar).toBe('function');
      expect(typeof result.current.showTabBar).toBe('function');
    });
  });

  describe('hideTabBar', () => {
    it('deve esconder a tab bar ao chamar hideTabBar', () => {
      const { result } = renderHook(() => useTabBarContext(), { wrapper });

      act(() => {
        result.current.hideTabBar();
      });

      expect(result.current.isTabBarVisible).toBe(false);
    });

    it('deve manter a tab bar escondida ao chamar hideTabBar duas vezes', () => {
      const { result } = renderHook(() => useTabBarContext(), { wrapper });

      act(() => {
        result.current.hideTabBar();
      });
      act(() => {
        result.current.hideTabBar();
      });

      expect(result.current.isTabBarVisible).toBe(false);
    });
  });

  describe('showTabBar', () => {
    it('deve mostrar a tab bar ao chamar showTabBar', () => {
      const { result } = renderHook(() => useTabBarContext(), { wrapper });

      act(() => {
        result.current.hideTabBar();
      });
      expect(result.current.isTabBarVisible).toBe(false);

      act(() => {
        result.current.showTabBar();
      });
      expect(result.current.isTabBarVisible).toBe(true);
    });

    it('deve manter a tab bar visivel ao chamar showTabBar quando ja esta visivel', () => {
      const { result } = renderHook(() => useTabBarContext(), { wrapper });

      act(() => {
        result.current.showTabBar();
      });

      expect(result.current.isTabBarVisible).toBe(true);
    });
  });

  describe('Alternancia entre estados', () => {
    it('deve alternar corretamente entre esconder e mostrar', () => {
      const { result } = renderHook(() => useTabBarContext(), { wrapper });

      expect(result.current.isTabBarVisible).toBe(true);

      act(() => {
        result.current.hideTabBar();
      });
      expect(result.current.isTabBarVisible).toBe(false);

      act(() => {
        result.current.showTabBar();
      });
      expect(result.current.isTabBarVisible).toBe(true);

      act(() => {
        result.current.hideTabBar();
      });
      expect(result.current.isTabBarVisible).toBe(false);
    });
  });
});
