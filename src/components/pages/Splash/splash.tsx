import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { StyleSheet } from 'react-native';

export function Splash() {
  function onPlaybackStatusUpdate(status: AVPlaybackStatus) {}

  return (
    <Video
      style={StyleSheet.absoluteFill}
      resizeMode={ResizeMode.COVER}
      source={require('../../../../assets/splash.mp4')}
      isLooping={false}
      onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      shouldPlay
    />
  );
}
