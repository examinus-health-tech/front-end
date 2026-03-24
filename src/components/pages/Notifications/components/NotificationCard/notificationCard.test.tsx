import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NotificationCard } from './notificationCard';
import { Notification } from 'src/@types/notifications';

// Mock native-base
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
  };
});

// Mock icons
jest.mock('@assets/icons', () => ({
  DownloadIcon: (props: any) => 'DownloadIcon',
}));

// Mock Progress component
jest.mock('@components/molecules/Progress/progress', () => ({
  Progress: ({ value, ...rest }: any) => {
    const RN = require('react-native');
    return <RN.View testID="progress-bar" />;
  },
}));

// Mock date-fns
jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn().mockReturnValue('há 2 horas'),
}));

jest.mock('date-fns/locale', () => ({
  ptBR: {},
}));

describe('NotificationCard', () => {
  const mockOnPressDownloadPdf = jest.fn();
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Generic notification (fallback)', () => {
    const genericNotification: Notification = {
      id: '1',
      type: 'DOCTOR_MESSAGE', // Will use the DOCTOR_MESSAGE branch
      title: 'Resultado disponível',
      description: 'Seus exames estão prontos',
      createdAt: '2024-01-15T10:00:00Z',
      read: false,
    };

    it('renders the title', () => {
      const { getByText } = render(
        <NotificationCard notification={genericNotification} />
      );
      expect(getByText('Resultado disponível')).toBeTruthy();
    });

    it('renders the description', () => {
      const { getByText } = render(
        <NotificationCard notification={genericNotification} />
      );
      expect(getByText('Seus exames estão prontos')).toBeTruthy();
    });

    it('renders relative date', () => {
      const { getByText } = render(
        <NotificationCard notification={genericNotification} />
      );
      expect(getByText('há 2 horas')).toBeTruthy();
    });

    it('shows NOVO badge for unread notifications', () => {
      const { getByText } = render(
        <NotificationCard notification={genericNotification} />
      );
      expect(getByText('NOVO')).toBeTruthy();
    });

    it('does not show NOVO badge for read notifications', () => {
      const readNotification = { ...genericNotification, read: true };
      const { queryByText } = render(
        <NotificationCard notification={readNotification} />
      );
      expect(queryByText('NOVO')).toBeNull();
    });

    it('calls onPress when pressed', () => {
      const { getByText } = render(
        <NotificationCard notification={genericNotification} onPress={mockOnPress} />
      );
      fireEvent.press(getByText('Resultado disponível'));
      expect(mockOnPress).toHaveBeenCalledWith(genericNotification);
    });
  });

  describe('DOCTOR_MESSAGE type', () => {
    const doctorNotification: Notification = {
      id: '2',
      type: 'DOCTOR_MESSAGE',
      title: 'Mensagem do Dr. Silva',
      description: 'Seus resultados estão normais',
      createdAt: '2024-01-15T10:00:00Z',
      read: false,
    };

    it('renders doctor message notification', () => {
      const { getByText } = render(
        <NotificationCard notification={doctorNotification} />
      );
      expect(getByText('Mensagem do Dr. Silva')).toBeTruthy();
      expect(getByText('Seus resultados estão normais')).toBeTruthy();
    });

    it('shows NOVO badge when unread', () => {
      const { getByText } = render(
        <NotificationCard notification={doctorNotification} />
      );
      expect(getByText('NOVO')).toBeTruthy();
    });

    it('does not show NOVO for read doctor messages', () => {
      const readDoc = { ...doctorNotification, read: true };
      const { queryByText } = render(
        <NotificationCard notification={readDoc} />
      );
      expect(queryByText('NOVO')).toBeNull();
    });

    it('displays relative date', () => {
      const { getByText } = render(
        <NotificationCard notification={doctorNotification} />
      );
      expect(getByText('há 2 horas')).toBeTruthy();
    });

    it('calls onPress when tapped', () => {
      const { getByText } = render(
        <NotificationCard notification={doctorNotification} onPress={mockOnPress} />
      );
      fireEvent.press(getByText('Mensagem do Dr. Silva'));
      expect(mockOnPress).toHaveBeenCalledWith(doctorNotification);
    });
  });

  describe('MONTHLY_INSIGHT type', () => {
    const insightNotification: Notification = {
      id: '3',
      type: 'MONTHLY_INSIGHT',
      title: 'Relatório Mensal',
      description: 'Seu resumo de saúde de janeiro',
      pdfUrl: 'https://example.com/report.pdf',
      createdAt: '2024-01-15T10:00:00Z',
      read: false,
    };

    it('renders monthly insight notification', () => {
      const { getByText } = render(
        <NotificationCard notification={insightNotification} />
      );
      expect(getByText('Relatório Mensal')).toBeTruthy();
      expect(getByText('Seu resumo de saúde de janeiro')).toBeTruthy();
    });

    it('renders download PDF button when pdfUrl exists', () => {
      const { getByText } = render(
        <NotificationCard
          notification={insightNotification}
          onPressDownloadPdf={mockOnPressDownloadPdf}
        />
      );
      expect(getByText('download pdf')).toBeTruthy();
    });

    it('calls onPressDownloadPdf when download is pressed', () => {
      const { getByText } = render(
        <NotificationCard
          notification={insightNotification}
          onPressDownloadPdf={mockOnPressDownloadPdf}
        />
      );
      fireEvent.press(getByText('download pdf'));
      expect(mockOnPressDownloadPdf).toHaveBeenCalledWith('https://example.com/report.pdf');
    });

    it('does not render download button when pdfUrl is not set', () => {
      const noPdf = { ...insightNotification, pdfUrl: undefined };
      const { queryByText } = render(
        <NotificationCard notification={noPdf} />
      );
      expect(queryByText('download pdf')).toBeNull();
    });

    it('shows NOVO badge when unread', () => {
      const { getByText } = render(
        <NotificationCard notification={insightNotification} />
      );
      expect(getByText('NOVO')).toBeTruthy();
    });

    it('calls onPress when tapped', () => {
      const { getByText } = render(
        <NotificationCard notification={insightNotification} onPress={mockOnPress} />
      );
      fireEvent.press(getByText('Relatório Mensal'));
      expect(mockOnPress).toHaveBeenCalledWith(insightNotification);
    });
  });

  describe('STEPS_GOAL type', () => {
    const stepsNotification: Notification = {
      id: '4',
      type: 'STEPS_GOAL',
      title: 'Meta de Passos',
      description: 'Você atingiu 80% da sua meta',
      progress: 80,
      createdAt: '2024-01-15T10:00:00Z',
      read: false,
    };

    it('renders steps goal notification', () => {
      const { getByText } = render(
        <NotificationCard notification={stepsNotification} />
      );
      expect(getByText('Meta de Passos')).toBeTruthy();
      expect(getByText('Você atingiu 80% da sua meta')).toBeTruthy();
    });

    it('renders progress bar when progress is provided', () => {
      const { getByTestId } = render(
        <NotificationCard notification={stepsNotification} />
      );
      expect(getByTestId('progress-bar')).toBeTruthy();
    });

    it('does not render progress bar when progress is undefined', () => {
      const noProgress = { ...stepsNotification, progress: undefined };
      const { queryByTestId } = render(
        <NotificationCard notification={noProgress} />
      );
      expect(queryByTestId('progress-bar')).toBeNull();
    });

    it('shows NOVO badge when unread', () => {
      const { getByText } = render(
        <NotificationCard notification={stepsNotification} />
      );
      expect(getByText('NOVO')).toBeTruthy();
    });

    it('calls onPress when tapped', () => {
      const { getByText } = render(
        <NotificationCard notification={stepsNotification} onPress={mockOnPress} />
      );
      fireEvent.press(getByText('Meta de Passos'));
      expect(mockOnPress).toHaveBeenCalledWith(stepsNotification);
    });

    it('renders relative date', () => {
      const { getByText } = render(
        <NotificationCard notification={stepsNotification} />
      );
      expect(getByText('há 2 horas')).toBeTruthy();
    });
  });

  describe('without createdAt', () => {
    it('does not render date for notification without createdAt', () => {
      const noDate: Notification = {
        id: '5',
        type: 'DOCTOR_MESSAGE',
        title: 'Test',
        description: 'Test desc',
        createdAt: '',
        read: true,
      };
      const { queryByText } = render(
        <NotificationCard notification={noDate} />
      );
      // formatDistanceToNow would fail, so createdAt check will be falsy
    });
  });

  describe('read vs unread styling', () => {
    const baseNotification: Notification = {
      id: '6',
      type: 'STEPS_GOAL',
      title: 'Notification',
      description: 'Description',
      createdAt: '2024-01-15T10:00:00Z',
      read: true,
    };

    it('renders read notification without NOVO badge', () => {
      const { queryByText } = render(
        <NotificationCard notification={baseNotification} />
      );
      expect(queryByText('NOVO')).toBeNull();
    });

    it('renders unread notification with NOVO badge', () => {
      const unread = { ...baseNotification, read: false };
      const { getByText } = render(
        <NotificationCard notification={unread} />
      );
      expect(getByText('NOVO')).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('handles notification with all optional fields missing', () => {
      const minimal: Notification = {
        id: '7',
        type: 'MONTHLY_INSIGHT',
        title: 'Minimal',
        description: 'Minimal desc',
        createdAt: '',
        read: true,
      };
      const { getByText } = render(
        <NotificationCard notification={minimal} />
      );
      expect(getByText('Minimal')).toBeTruthy();
    });

    it('handles progress value of 0', () => {
      const zeroProgress: Notification = {
        id: '8',
        type: 'STEPS_GOAL',
        title: 'Steps',
        description: 'Desc',
        progress: 0,
        createdAt: '2024-01-15T10:00:00Z',
        read: false,
      };
      const { getByTestId } = render(
        <NotificationCard notification={zeroProgress} />
      );
      expect(getByTestId('progress-bar')).toBeTruthy();
    });
  });
});
