const { withEntitlementsPlist, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const APP_GROUP_NAME = 'group.com.examinus.app.OneSignalNotificationServiceExtension';

/**
 * Plugin para sobrescrever o App Group do OneSignal
 * Roda DEPOIS do OneSignal plugin e sobrescreve os valores
 */
function withCustomAppGroup(config) {
  // 1. Modifica entitlements do app principal (sobrescreve completamente)
  config = withEntitlementsPlist(config, (config) => {
    // Remove qualquer App Group existente e usa apenas o correto
    config.modResults['com.apple.security.application-groups'] = [APP_GROUP_NAME];
    return config;
  });

  // 2. Modifica entitlements da extensão NSE durante prebuild
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const nseEntitlementsPath = path.join(
        projectRoot,
        'ios',
        'OneSignalNotificationServiceExtension',
        'OneSignalNotificationServiceExtension.entitlements'
      );

      // Aguarda um pouco para garantir que o arquivo foi criado pelo OneSignal plugin
      await new Promise(resolve => setTimeout(resolve, 100));

      if (fs.existsSync(nseEntitlementsPath)) {
        // Cria o conteúdo do entitlements com o App Group correto
        const newContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>com.apple.security.application-groups</key>
	<array>
		<string>${APP_GROUP_NAME}</string>
	</array>
</dict>
</plist>
`;
        fs.writeFileSync(nseEntitlementsPath, newContent);
        console.log('✅ [withCustomAppGroup] NSE entitlements atualizado com App Group:', APP_GROUP_NAME);
      } else {
        console.log('⚠️ [withCustomAppGroup] NSE entitlements não encontrado em:', nseEntitlementsPath);
      }

      return config;
    },
  ]);

  return config;
}

module.exports = withCustomAppGroup;
