import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { View, Image } from 'native-base';
import { useVideoPlayer, VideoView } from 'expo-video';

export function Splash() {
  const [videoError, setVideoError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const splash = require('../../../../assets/splash.mp4');
  const splashImage = require('../../../../assets/splash.png');

  const player = useVideoPlayer(splash, (player) => {
    player.loop = true;
    
    // Configurações específicas por plataforma
    if (Platform.OS === 'android') {
      player.muted = true; // Importante para autoplay no Android
      setTimeout(() => {
        player.play();
      }, 500);
    } else {
      // iOS - reprodução imediata
      player.play();
    }
  });

  // Timeout de segurança para fallback
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isReady) {
        console.log(`Video timeout on ${Platform.OS}, using fallback`);
        setVideoError(true);
      }
    }, Platform.OS === 'android' ? 3000 : 5000); // iOS timeout maior

    return () => clearTimeout(timeout);
  }, [isReady]);

  // Se houver erro no vídeo, usar imagem
  if (videoError) {
    return (
      <View flex={1} bg="white" alignItems="center" justifyContent="center">
        <Image
          source={splashImage}
          alt="Examinus Splash"
          resizeMode="contain"
          width="100%"
          height="100%"
        />
      </View>
    );
  }

  return (
    <View flex={1} bg="black">
      <VideoView
        style={{ 
          width: '100%', 
          height: '100%',
          backgroundColor: 'black'
        }}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
        contentFit="cover"
        onPlaybackStatusUpdate={(status) => {
          // Marcar como pronto quando começar a tocar ou estiver carregado
          if ((status.isLoaded || status.isPlaying) && !isReady) {
            console.log('Video is ready:', { isLoaded: status.isLoaded, isPlaying: status.isPlaying });
            setIsReady(true);
          }
          if (status.error) {
            console.log('Video playback error:', status.error);
            setVideoError(true);
          }
        }}
      />
      
      {/* Loading overlay enquanto vídeo não carrega */}
      {!isReady && (
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
          <Image
            source={splashImage}
            alt="Loading Splash"
            resizeMode="contain"
            width="100%"
            height="100%"
          />
        </View>
      )}
    </View>
  );
}
