import { useState, useEffect } from 'react';
import { Platform, Dimensions, StatusBar } from 'react-native';
import { View, Image } from 'native-base';
import { useVideoPlayer, VideoView } from 'expo-video';

// Usar 'screen' ao invés de 'window' para incluir a área da barra de status
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

export function Splash() {
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const splash = require('../../../assets/splash.mp4');
  const splashImage = require('../../../../assets/splash.png');

  if (__DEV__) console.log(`Splash component mounted on ${Platform.OS}, video source:`, splash);

  const player = useVideoPlayer(splash, (player) => {
    if (__DEV__) console.log('Video player initialized');
    player.loop = false;
    // Autoplay com áudio é bloqueado no Android sem interação do usuário
    if (Platform.OS === 'android') {
      player.muted = true;
    }
  });

  useEffect(() => {
    if (!player) return;

    const playSafe = () => {
      try {
        player.play();
      } catch (e) {
        if (__DEV__) console.warn('Splash video play failed:', e);
        setHasError(true);
      }
    };

    const statusSubscription = player.addListener('statusChange', (event) => {
      if (__DEV__) console.log(`Video status on ${Platform.OS}:`, event);
      const status = (event as any)?.status || event;
      if ((status === 'readyToPlay' || status === 'playing') && !isReady) {
        if (__DEV__) console.log('Video is ready!');
        setIsReady(true);
        playSafe();
      }
      if (status === 'error') {
        if (__DEV__) console.error('Video error');
        setHasError(true);
      }
    });

    // Caso o player já esteja pronto antes do listener anexar (cache, fast-path)
    if ((player as any).status === 'readyToPlay' && !isReady) {
      setIsReady(true);
      playSafe();
    }

    return () => {
      statusSubscription?.remove();
    };
  }, [player, isReady]);

  // Se houver erro, mostrar imagem
  if (hasError) {
    if (__DEV__) console.log('Showing fallback image due to error');
    return (
      <View style={{ flex: 1, backgroundColor: 'white', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <StatusBar hidden />
        <Image
          source={splashImage}
          alt="Examinus Splash"
          resizeMode="cover"
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Platform.OS === 'android' ? 'black' : 'transparent', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <StatusBar hidden />
      <VideoView
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: Platform.OS === 'android' ? 'black' : 'transparent',
        }}
        player={player}
        nativeControls={false}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        contentFit="cover"
      />

      {/* Loading image para Android enquanto vídeo não carrega */}
      {Platform.OS === 'android' && !isReady && (
        <View
          position="absolute"
          top={0}
          left={0}
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          bg="white"
        >
          <Image
            source={splashImage}
            alt="Loading Splash"
            resizeMode="cover"
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT}
          />
        </View>
      )}
    </View>
  );
}
