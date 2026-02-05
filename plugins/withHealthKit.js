const { withEntitlementsPlist, withInfoPlist } = require('@expo/config-plugins');

const withHealthKit = (config) => {
  // Adiciona entitlements do HealthKit
  config = withEntitlementsPlist(config, (config) => {
    config.modResults['com.apple.developer.healthkit'] = true;
    config.modResults['com.apple.developer.healthkit.access'] = [];
    config.modResults['com.apple.developer.healthkit.background-delivery'] = false;
    return config;
  });

  // Adiciona UIRequiredDeviceCapabilities para HealthKit
  config = withInfoPlist(config, (config) => {
    // Adiciona healthkit às capabilities requeridas
    if (!config.modResults.UIRequiredDeviceCapabilities) {
      config.modResults.UIRequiredDeviceCapabilities = [];
    }
    if (!config.modResults.UIRequiredDeviceCapabilities.includes('healthkit')) {
      config.modResults.UIRequiredDeviceCapabilities.push('healthkit');
    }
    return config;
  });

  return config;
};

module.exports = withHealthKit;
