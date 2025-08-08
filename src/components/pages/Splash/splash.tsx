import { useState } from 'react';
import { View, Image } from 'native-base';
import { useVideoPlayer, VideoView } from 'expo-video';

export function Splash() {
  const [hasError, setHasError] = useState(false);
  const splash = require('../../../assets/splash.mp4');
  const splashImage = require('../../../../assets/splash.png');

  console.log('Splash component mounted, video source:', splash);

  const player = useVideoPlayer(splash, (player) => {
    console.log('Video player initialized');
    player.loop = true;
    player.play();
  });

  // Se houver erro, mostrar imagem
  if (hasError) {
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
    <View flex={1}>
      <VideoView
        style={{ width: '100%', height: '100%' }}
        player={player}
        nativeControls={false}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        onPlaybackStatusUpdate={(status) => {
          console.log('Video status:', status);
          if (status.error) {
            console.error('Video error:', status.error);
            setHasError(true);
          }
        }}
      />
    </View>
  );
}
