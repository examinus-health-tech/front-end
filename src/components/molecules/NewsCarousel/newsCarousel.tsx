import { useEffect, useState, useCallback, useMemo } from 'react';
import { Linking, Dimensions } from 'react-native';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Skeleton, Image } from 'native-base';

// assets
import { ChevronRightSmIcon, DocumentIcon, LightBulbIcon } from '@assets/icons';

// services
import { NewsItem, fetchHealthTipsNews, fetchNewsForSystem, formatPubDate } from 'src/services/newsService';

// data
import { getOrganTips } from 'src/data/organTips';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.82;
const IMAGE_SIZE = 88;

type NewsCarouselProps = {
  title?: string;
  system?: string; // Sistema orgânico (ex: "Sangue", "Coração") — notícias temáticas + dicas curadas
};

// Card do carrossel: notícia do feed ou dica curada (src/data/organTips.ts)
type CarouselItem = {
  key: string;
  kind: 'news' | 'tip';
  title: string;
  description?: string;
  link: string;
  imageUrl?: string;
  pubDate?: string;
  source?: string;
};

export function NewsCarousel({ title = 'Notícias de Saúde', system }: NewsCarouselProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Com sistema: só notícias cujo título é sobre ele (pode vir vazio — as dicas
      // curadas completam). Sem sistema: notícias de dicas de saúde gerais.
      const newsItems = system
        ? await fetchNewsForSystem(system)
        : await fetchHealthTipsNews();

      setNews(newsItems || []);
    } catch (err) {
      console.error('Erro ao carregar notícias:', err);
      setError('Não foi possível carregar as notícias');
    } finally {
      setIsLoading(false);
    }
  }, [system]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const items = useMemo<CarouselItem[]>(() => {
    const newsItems: CarouselItem[] = news.slice(0, 10).map((item) => ({
      key: item.id,
      kind: 'news',
      title: item.title,
      description: item.description,
      link: item.link,
      imageUrl: item.imageUrl,
      pubDate: item.pubDate,
    }));

    if (!system) return newsItems;

    // Notícias realmente temáticas primeiro, depois as dicas curadas do sistema
    const tipItems: CarouselItem[] = getOrganTips(system).map((tip) => ({
      key: tip.id,
      kind: 'tip',
      title: tip.title,
      description: tip.description,
      link: tip.url,
      source: tip.source,
    }));
    return [...newsItems, ...tipItems];
  }, [news, system]);

  const handleOpenNews = (url: string) => {
    Linking.openURL(url).catch((err) => {
      console.error('Erro ao abrir link:', err);
    });
  };

  if (error && items.length === 0) {
    return null; // Não mostra nada se houver erro e nada para exibir
  }

  return (
    <VStack mt={4}>
      {/* Header */}
      <HStack alignItems="center" justifyContent="space-between" mb={3} mx={6}>
        <Text fontFamily="Poligon" fontSize={18} fontWeight={700} color="gray.900" letterSpacing={-0.18}>
          {title}
        </Text>
        {/* Com sistema as fontes variam (cada card mostra a sua) */}
        {!system && (
          <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="gray.400">
            G1 Bem Estar
          </Text>
        )}
      </HStack>

      {/* Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 8 }}
      >
        <HStack space={3}>
          {isLoading ? (
            // Loading skeletons
            <>
              {[1, 2, 3].map((_, index) => (
                <Box key={index} width={CARD_WIDTH} bg="white" borderRadius={14} p={3} shadow={2}>
                  <HStack space={3}>
                    <Skeleton w={IMAGE_SIZE} h={IMAGE_SIZE} rounded="lg" />
                    <VStack flex={1} justifyContent="space-between" h={IMAGE_SIZE}>
                      <VStack>
                        <Skeleton h={3} mb={1} rounded="md" />
                        <Skeleton h={3} mb={1} rounded="md" />
                        <Skeleton h={2} w="80%" rounded="md" />
                      </VStack>
                      <Skeleton h={2} w="40%" rounded="md" />
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </>
          ) : items.length > 0 ? (
            items.map((item) => (
              <Pressable key={item.key} onPress={() => handleOpenNews(item.link)}>
                {({ isPressed }) => (
                  <Box
                    testID={item.kind === 'tip' ? `tip-card-${item.key}` : undefined}
                    width={CARD_WIDTH}
                    bg="white"
                    borderRadius={14}
                    p={3}
                    shadow={2}
                    opacity={isPressed ? 0.8 : 1}
                    style={{ transform: [{ scale: isPressed ? 0.98 : 1 }] }}
                  >
                    <HStack space={3}>
                      {/* Imagem da notícia / ícone da dica */}
                      {item.kind === 'news' && item.imageUrl ? (
                        <Image
                          source={{ uri: item.imageUrl }}
                          alt={item.title}
                          w={IMAGE_SIZE}
                          h={IMAGE_SIZE}
                          borderRadius={10}
                          bg="gray.100"
                          resizeMode="cover"
                        />
                      ) : (
                        <Box
                          w={IMAGE_SIZE}
                          h={IMAGE_SIZE}
                          borderRadius={10}
                          bg={item.kind === 'tip' ? 'ciano.50' : 'gray.100'}
                          alignItems="center"
                          justifyContent="center"
                        >
                          {item.kind === 'tip' ? (
                            <LightBulbIcon size="30" color="#0CC1AF" />
                          ) : (
                            <DocumentIcon size="28" color="#9CA3AF" />
                          )}
                        </Box>
                      )}

                      {/* Conteúdo */}
                      <VStack flex={1} justifyContent="space-between" h={IMAGE_SIZE}>
                        <VStack>
                          <Text
                            fontFamily="Poligon"
                            fontSize={13}
                            fontWeight={700}
                            color="gray.800"
                            numberOfLines={2}
                            lineHeight={17}
                          >
                            {item.title}
                          </Text>

                          {item.description && (
                            <Text
                              fontFamily="Poligon"
                              fontSize={12}
                              fontWeight={500}
                              color="gray.500"
                              numberOfLines={2}
                              mt={0.5}
                              lineHeight={14}
                            >
                              {item.description}
                            </Text>
                          )}
                        </VStack>

                        <HStack alignItems="center" space={2}>
                          {item.kind === 'news' && item.pubDate && (
                            <Box bg="ciano.50" px={1.5} py={0.5} borderRadius={4}>
                              <Text fontFamily="Poligon" fontSize={12} fontWeight={600} color="ciano.600">
                                {formatPubDate(item.pubDate)}
                              </Text>
                            </Box>
                          )}
                          {item.kind === 'tip' && item.source && (
                            <Text
                              flexShrink={1}
                              fontFamily="Poligon"
                              fontSize={12}
                              fontWeight={600}
                              color="gray.400"
                              numberOfLines={1}
                            >
                              {item.source}
                            </Text>
                          )}
                          <HStack alignItems="center" space={0.5}>
                            <Text fontFamily="Poligon" fontSize={12} fontWeight={600} color="ciano.300">
                              Ler mais
                            </Text>
                            <ChevronRightSmIcon size="12" color="#0CC1AF" />
                          </HStack>
                        </HStack>
                      </VStack>
                    </HStack>
                  </Box>
                )}
              </Pressable>
            ))
          ) : (
            // Empty state
            <Box
              width={CARD_WIDTH}
              bg="gray.50"
              borderRadius={14}
              p={4}
              alignItems="center"
              justifyContent="center"
              minH={IMAGE_SIZE + 24}
            >
              <DocumentIcon size="28" color="#9CA3AF" />
              <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="gray.400" mt={2} textAlign="center">
                {system ? 'Nenhuma dica disponível' : 'Nenhuma notícia disponível'}
              </Text>
            </Box>
          )}
        </HStack>
      </ScrollView>
    </VStack>
  );
}
