import { useEffect, useState, useCallback } from 'react';
import { Linking, Dimensions } from 'react-native';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Skeleton, Image } from 'native-base';

// assets
import { ChevronRightSmIcon, DocumentIcon } from '@assets/icons';

// services
import { NewsItem, fetchHealthTipsNews, fetchNewsForSystem, formatPubDate } from 'src/services/newsService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.82;
const IMAGE_SIZE = 88;

type NewsCarouselProps = {
  title?: string;
  system?: string; // Sistema orgânico para filtrar notícias (ex: "imunidade", "coração")
};

export function NewsCarousel({ title = 'Notícias de Saúde', system }: NewsCarouselProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Se um sistema foi especificado, busca notícias filtradas para ele
      // Caso contrário, busca notícias de dicas de saúde gerais
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

  const handleOpenNews = (url: string) => {
    Linking.openURL(url).catch((err) => {
      console.error('Erro ao abrir link:', err);
    });
  };

  if (error && news.length === 0) {
    return null; // Não mostra nada se houver erro e não tiver cache
  }

  return (
    <VStack mt={4}>
      {/* Header */}
      <HStack alignItems="center" justifyContent="space-between" mb={3} mx={6}>
        <Text fontFamily="Poligon" fontSize={18} fontWeight={700} color="gray.900" letterSpacing={-0.18}>
          {title}
        </Text>
        <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="gray.400">
          G1 Bem Estar
        </Text>
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
          ) : news.length > 0 ? (
            // News cards
            news.slice(0, 10).map((item) => (
              <Pressable key={item.id} onPress={() => handleOpenNews(item.link)}>
                {({ isPressed }) => (
                  <Box
                    width={CARD_WIDTH}
                    bg="white"
                    borderRadius={14}
                    p={3}
                    shadow={2}
                    opacity={isPressed ? 0.8 : 1}
                    style={{ transform: [{ scale: isPressed ? 0.98 : 1 }] }}
                  >
                    <HStack space={3}>
                      {/* Imagem da notícia */}
                      {item.imageUrl ? (
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
                          bg="gray.100"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <DocumentIcon size="28" color="#9CA3AF" />
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
                          {item.pubDate && (
                            <Box bg="ciano.50" px={1.5} py={0.5} borderRadius={4}>
                              <Text fontFamily="Poligon" fontSize={12} fontWeight={600} color="ciano.600">
                                {formatPubDate(item.pubDate)}
                              </Text>
                            </Box>
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
                Nenhuma notícia disponível
              </Text>
            </Box>
          )}
        </HStack>
      </ScrollView>
    </VStack>
  );
}
