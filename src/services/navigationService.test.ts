/**
 * Testes unitários para navigationService.ts
 */

jest.mock('@react-navigation/native', () => ({
  createNavigationContainerRef: jest.fn(() => ({
    isReady: jest.fn(),
    navigate: jest.fn(),
  })),
}));

import { navigationRef, navigate } from './navigationService';

describe('navigationService', () => {
  // --------------------------------------------------------
  // navigationRef
  // --------------------------------------------------------
  describe('navigationRef', () => {
    it('deve exportar uma referência de navegação', () => {
      expect(navigationRef).toBeDefined();
      expect(navigationRef.isReady).toBeDefined();
      expect(navigationRef.navigate).toBeDefined();
    });
  });

  // --------------------------------------------------------
  // navigate
  // --------------------------------------------------------
  describe('navigate', () => {
    it('deve chamar navigate quando navigationRef está pronta', () => {
      (navigationRef.isReady as jest.Mock).mockReturnValue(true);

      navigate('Home');

      expect(navigationRef.navigate).toHaveBeenCalledWith('Home', undefined);
    });

    it('deve chamar navigate com parâmetros quando fornecidos', () => {
      (navigationRef.isReady as jest.Mock).mockReturnValue(true);

      navigate('ExamDetail', { examId: '123' });

      expect(navigationRef.navigate).toHaveBeenCalledWith('ExamDetail', { examId: '123' });
    });

    it('deve NÃO chamar navigate quando navigationRef não está pronta', () => {
      (navigationRef.isReady as jest.Mock).mockReturnValue(false);
      (navigationRef.navigate as jest.Mock).mockClear();

      navigate('Home');

      expect(navigationRef.navigate).not.toHaveBeenCalled();
    });

    it('deve chamar navigate com parâmetros de objeto complexo', () => {
      (navigationRef.isReady as jest.Mock).mockReturnValue(true);

      const params = { id: 1, name: 'Teste', data: { nested: true } };
      navigate('Screen', params);

      expect(navigationRef.navigate).toHaveBeenCalledWith('Screen', params);
    });

    it('deve chamar navigate sem parâmetros quando params é undefined', () => {
      (navigationRef.isReady as jest.Mock).mockReturnValue(true);

      navigate('Settings');

      expect(navigationRef.navigate).toHaveBeenCalledWith('Settings', undefined);
    });

    it('deve verificar isReady antes de cada chamada de navigate', () => {
      (navigationRef.isReady as jest.Mock).mockReturnValue(true);
      navigate('Screen1');
      expect(navigationRef.isReady).toHaveBeenCalled();

      (navigationRef.isReady as jest.Mock).mockReturnValue(false);
      (navigationRef.navigate as jest.Mock).mockClear();
      navigate('Screen2');
      expect(navigationRef.navigate).not.toHaveBeenCalled();
    });
  });
});
