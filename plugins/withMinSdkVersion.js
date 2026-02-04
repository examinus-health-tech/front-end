const { withGradleProperties, withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Plugin para forçar minSdkVersion 26 no Android
 * Necessário para react-native-health-connect que requer API 26+
 */
function withMinSdkVersion(config, minSdk = 26) {
  // 1. Adiciona propriedade no gradle.properties
  config = withGradleProperties(config, (config) => {
    // Remove propriedade existente se houver
    config.modResults = config.modResults.filter(
      (item) => item.key !== 'android.minSdkVersion' && item.key !== 'expo.minSdkVersion'
    );

    // Adiciona a nova propriedade
    config.modResults.push({
      type: 'property',
      key: 'expo.minSdkVersion',
      value: String(minSdk),
    });

    console.log(`✅ [withMinSdkVersion] expo.minSdkVersion definido como ${minSdk}`);
    return config;
  });

  // 2. Modifica build.gradle para garantir que o valor seja usado
  config = withAppBuildGradle(config, (config) => {
    let buildGradle = config.modResults.contents;

    // Verifica se já existe uma definição fixa de minSdkVersion
    if (buildGradle.includes('minSdkVersion 26')) {
      console.log('✅ [withMinSdkVersion] minSdkVersion já está definido como 26');
      return config;
    }

    // Substitui a referência dinâmica por valor fixo como fallback
    // Isso garante que mesmo que rootProject.ext.minSdkVersion seja menor, usamos 26
    const oldPattern = /minSdkVersion rootProject\.ext\.minSdkVersion/;
    const newValue = `minSdkVersion Math.max(rootProject.ext.minSdkVersion, ${minSdk})`;

    if (oldPattern.test(buildGradle)) {
      buildGradle = buildGradle.replace(oldPattern, newValue);
      console.log(`✅ [withMinSdkVersion] build.gradle modificado para usar minSdk >= ${minSdk}`);
    }

    config.modResults.contents = buildGradle;
    return config;
  });

  return config;
}

module.exports = withMinSdkVersion;
