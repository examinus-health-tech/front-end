import { useState } from 'react';
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

  console.log(`Splash component mounted on ${Platform.OS}, video source:`, splash);

  const player = useVideoPlayer(splash, (player) => {
    console.log('Video player initialized');
    player.loop = false;

    // Configurações específicas para Android
    if (Platform.OS === 'android') {
      player.muted = true; // Crítico para Android
      // Aguardar um pouco antes de tocar
      setTimeout(() => {
        console.log('Starting video playback on Android');
        player.play();
      }, 1000);
    } else {
      player.play();
    }
  });

  // Se houver erro, mostrar imagem
  if (hasError) {
    console.log('Showing fallback image due to error');
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
        onPlaybackStatusUpdate={(status) => {
          console.log(`Video status on ${Platform.OS}:`, {
            isLoaded: status.isLoaded,
            isPlaying: status.isPlaying,
            error: status.error,
          });

          if (status.isLoaded && !isReady) {
            console.log('Video is ready!');
            setIsReady(true);
          }

          if (status.error) {
            console.error('Video error:', status.error);
            setHasError(true);
          }
        }}
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
