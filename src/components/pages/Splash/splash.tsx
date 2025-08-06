// import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useEffect, useRef } from 'react';
import { StyleSheet, Button } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { View } from 'native-base';

import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';

export function Splash() {
  const splash = require('../../../../assets/splash.mp4');

  const player = useVideoPlayer(splash, (player) => {
    player.play();
  });

  return (
    <View flex={1}>
      <VideoView
        style={{ width: '100%', height: '100%' }}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        nativeControls={false}
      />
    </View>
  );
}
