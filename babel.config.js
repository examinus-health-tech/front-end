module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],

    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@assets': './src/assets',
            '@fonts': './src/assets/fonts',
            '@atoms': './src/components/atoms',
            '@molecules': './src/components/molecules',
            '@organisms': './src/components/organisms',
            '@pages': './src/components/pages',
            '@components': './src/components',
            '@routes': './src/routes',
            '@contexts': './src/contexts',
            '@screens': './src/screens',
            '@storage': './src/storage',
            '@utils': './src/utils',
            '@navigation': './src/navigation',
            '@dtos': './src/dtos',

          },

        },
      ],
    ],
  };
};
