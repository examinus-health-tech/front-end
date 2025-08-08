import { useState } from 'react';
import { Platform } from 'react-native';
import { View, Image } from 'native-base';
import { useVideoPlayer, VideoView } from 'expo-video';

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
      <View flex={1} bg="white" alignItems="center" justifyContent="center">
        <Image source={splashImage} alt="Examinus Splash" resizeMode="contain" width="100%" height="100%" />
      </View>
    );
  }

  return (
    <View flex={1} bg={Platform.OS === 'android' ? 'black' : 'transparent'}>
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
          right={0}
          bottom={0}
          bg="white"
          alignItems="center"
          justifyContent="center"
        >
          <Image source={splashImage} alt="Loading Splash" resizeMode="contain" width="100%" height="100%" />
        </View>
      )}
    </View>
  );
}
