// import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import Video, { VideoRef } from 'react-native-video';

export function Splash() {
  const videoRef = useRef<VideoRef>(null);
  const splash = require('../../../../assets/splash.mp4');

  // function onPlaybackStatusUpdate(status: AVPlaybackStatus) {
  //   console.log('!@# status splash', status);
  // }

  // return <Video source={require('../../../../assets/splash.mp4')} ref={videoRef} />;
  return (
    // <Video
    //   style={StyleSheet.absoluteFill}
    //   resizeMode={ResizeMode.COVER}
    //   source={require('../../../../assets/splash.mp4')}
    //   isLooping={false}
    //   onPlaybackStatusUpdate={onPlaybackStatusUpdate}
    //   shouldPlay={true}
    // />
    <Video
      // Can be a URL or a local file.
      source={splash}
      // Store reference
      ref={videoRef}
      // Callback when remote video is buffering
      // onBuffer={onBuffer}
      // Callback when video cannot be loaded
      onError={(error) => console.log(error)}
    />
  );
}
