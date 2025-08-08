const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };
  config.resolver = {
    ...resolver,
    assetExts: [...resolver.assetExts.filter((ext) => ext !== 'svg'), 'png', 'jpg', 'jpeg', 'gif', 'webp'],
    sourceExts: [...resolver.sourceExts, 'svg'],
  };

  config.resolver.unstable_enablePackageExports = false;

  // Force JSC usage
  config.transformer.hermesCommand = null;
  
  return config;
})();
