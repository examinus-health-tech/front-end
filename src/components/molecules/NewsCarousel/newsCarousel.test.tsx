import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { NewsCarousel } from './newsCarousel';

const mockFetchHealthTipsNews = jest.fn();
const mockFetchNewsForSystem = jest.fn();
const mockFormatPubDate = jest.fn((date: string) => date);

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: (props: any) => require("react").createElement(RN.View, props),
    Text: (props: any) => require("react").createElement(RN.Text, props),
    HStack: (props: any) => require("react").createElement(RN.View, props),
    VStack: (props: any) => require("react").createElement(RN.View, props),
    ScrollView: (props: any) => require("react").createElement(RN.ScrollView, props),
    Pressable: (props: any) => {
      // NativeBase Pressable passes render function as children
      if (typeof props.children === 'function') {
        return require("react").createElement(
          RN.TouchableOpacity,
          { ...props, children: undefined },
          props.children({ isPressed: false })
        );
      }
      return require("react").createElement(RN.TouchableOpacity, props);
    },
    Skeleton: Object.assign(
      (props: any) => require("react").createElement(RN.View, { ...props, testID: props.testID || 'skeleton' }),
      { Text: (props: any) => require("react").createElement(RN.View, { ...props, testID: 'skeleton-text' }) }
    ),
    Image: (props: any) => require("react").createElement(RN.Image, { ...props, testID: props.testID || 'news-image' }),
  };
});

jest.mock('@assets/icons', () => ({
  ChevronRightSmIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'chevron-right' }),
  DocumentIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'document-icon' }),
}));

jest.mock('src/services/newsService', () => ({
  fetchHealthTipsNews: (...args: any[]) => mockFetchHealthTipsNews(...args),
  fetchNewsForSystem: (...args: any[]) => mockFetchNewsForSystem(...args),
  formatPubDate: (...args: any[]) => mockFormatPubDate(...args),
}));

const mockNewsItems = [
  {
    id: '1',
    title: 'Noticia 1',
    description: 'Descricao 1',
    link: 'https://example.com/1',
    imageUrl: 'https://example.com/image1.jpg',
    pubDate: '2025-01-01',
  },
  {
    id: '2',
    title: 'Noticia 2',
    description: null,
    link: 'https://example.com/2',
    imageUrl: null,
    pubDate: null,
  },
];

describe('NewsCarousel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
  });

  it('renders loading skeletons initially', () => {
    mockFetchHealthTipsNews.mockReturnValue(new Promise(() => {}));
    const { getAllByTestId } = render(<NewsCarousel />);
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0);
  });

  it('renders default title', async () => {
    mockFetchHealthTipsNews.mockResolvedValue(mockNewsItems);
    const { getByText } = render(<NewsCarousel />);
    await waitFor(() => {
      expect(getByText('Notícias de Saúde')).toBeTruthy();
    });
  });

  it('renders custom title', async () => {
    mockFetchHealthTipsNews.mockResolvedValue(mockNewsItems);
    const { getByText } = render(<NewsCarousel title="Cardiologia" />);
    await waitFor(() => {
      expect(getByText('Cardiologia')).toBeTruthy();
    });
  });

  it('renders source label', async () => {
    mockFetchHealthTipsNews.mockResolvedValue(mockNewsItems);
    const { getByText } = render(<NewsCarousel />);
    await waitFor(() => {
      expect(getByText('G1 Bem Estar')).toBeTruthy();
    });
  });

  it('fetches health tips news when no system is provided', async () => {
    mockFetchHealthTipsNews.mockResolvedValue(mockNewsItems);
    render(<NewsCarousel />);
    await waitFor(() => {
      expect(mockFetchHealthTipsNews).toHaveBeenCalled();
    });
  });

  it('fetches system-specific news when system is provided', async () => {
    mockFetchNewsForSystem.mockResolvedValue(mockNewsItems);
    render(<NewsCarousel system="coração" />);
    await waitFor(() => {
      expect(mockFetchNewsForSystem).toHaveBeenCalledWith('coração');
    });
  });

  it('renders news cards after loading', async () => {
    mockFetchHealthTipsNews.mockResolvedValue(mockNewsItems);
    const { getByText } = render(<NewsCarousel />);
    await waitFor(() => {
      expect(getByText('Noticia 1')).toBeTruthy();
      expect(getByText('Noticia 2')).toBeTruthy();
    });
  });

  it('renders news description when available', async () => {
    mockFetchHealthTipsNews.mockResolvedValue(mockNewsItems);
    const { getByText } = render(<NewsCarousel />);
    await waitFor(() => {
      expect(getByText('Descricao 1')).toBeTruthy();
    });
  });

  it('renders image when imageUrl is available', async () => {
    mockFetchHealthTipsNews.mockResolvedValue(mockNewsItems);
    const { getAllByTestId } = render(<NewsCarousel />);
    await waitFor(() => {
      expect(getAllByTestId('news-image').length).toBeGreaterThan(0);
    });
  });

  it('renders document icon placeholder when no image', async () => {
    mockFetchHealthTipsNews.mockResolvedValue([mockNewsItems[1]]);
    const { getByTestId } = render(<NewsCarousel />);
    await waitFor(() => {
      expect(getByTestId('document-icon')).toBeTruthy();
    });
  });

  it('renders pubDate when available', async () => {
    mockFetchHealthTipsNews.mockResolvedValue(mockNewsItems);
    render(<NewsCarousel />);
    await waitFor(() => {
      expect(mockFormatPubDate).toHaveBeenCalledWith('2025-01-01');
    });
  });

  it('renders "Ler mais" text', async () => {
    mockFetchHealthTipsNews.mockResolvedValue(mockNewsItems);
    const { getAllByText } = render(<NewsCarousel />);
    await waitFor(() => {
      expect(getAllByText('Ler mais').length).toBeGreaterThan(0);
    });
  });

  it('renders empty state when no news', async () => {
    mockFetchHealthTipsNews.mockResolvedValue([]);
    const { getByText } = render(<NewsCarousel />);
    await waitFor(() => {
      expect(getByText('Nenhuma notícia disponível')).toBeTruthy();
    });
  });

  it('returns null when error occurs and no cached news', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockFetchHealthTipsNews.mockRejectedValue(new Error('Network error'));
    const { toJSON } = render(<NewsCarousel />);
    await waitFor(() => {
      expect(toJSON()).toBeNull();
    });
    consoleSpy.mockRestore();
  });

  it('limits displayed news to 10 items', async () => {
    const manyItems = Array.from({ length: 15 }, (_, i) => ({
      id: `${i}`,
      title: `News ${i}`,
      description: `Desc ${i}`,
      link: `https://example.com/${i}`,
      imageUrl: null,
      pubDate: null,
    }));
    mockFetchHealthTipsNews.mockResolvedValue(manyItems);
    const { queryByText } = render(<NewsCarousel />);
    await waitFor(() => {
      expect(queryByText('News 0')).toBeTruthy();
      expect(queryByText('News 9')).toBeTruthy();
      expect(queryByText('News 10')).toBeNull();
    });
  });

  it('handles null returned from fetch gracefully', async () => {
    mockFetchHealthTipsNews.mockResolvedValue(null);
    const { getByText } = render(<NewsCarousel />);
    await waitFor(() => {
      expect(getByText('Nenhuma notícia disponível')).toBeTruthy();
    });
  });
});
