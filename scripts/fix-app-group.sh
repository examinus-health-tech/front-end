#!/bin/bash

# Script para corrigir o App Group após o prebuild
# O OneSignal plugin usa group.com.examinus.app.onesignal mas precisamos usar
# group.com.examinus.app.OneSignalNotificationServiceExtension

APP_GROUP="group.com.examinus.app.OneSignalNotificationServiceExtension"
WRONG_GROUP="group.com.examinus.app.onesignal"

echo "🔧 Corrigindo App Group nos entitlements..."

# Fix main app entitlements
MAIN_ENTITLEMENTS="ios/ExaminusHealth/ExaminusHealth.entitlements"
if [ -f "$MAIN_ENTITLEMENTS" ]; then
    # Remove o grupo errado e mantém apenas o correto
    sed -i '' "s|<string>$WRONG_GROUP</string>||g" "$MAIN_ENTITLEMENTS"
    # Remove linhas vazias extras
    sed -i '' '/^[[:space:]]*$/d' "$MAIN_ENTITLEMENTS"
    echo "✅ Main app entitlements corrigido"
fi

# Fix NSE entitlements
NSE_ENTITLEMENTS="ios/OneSignalNotificationServiceExtension/OneSignalNotificationServiceExtension.entitlements"
if [ -f "$NSE_ENTITLEMENTS" ]; then
    # Substitui o grupo errado pelo correto
    sed -i '' "s|$WRONG_GROUP|$APP_GROUP|g" "$NSE_ENTITLEMENTS"
    echo "✅ NSE entitlements corrigido"
fi

echo "🎉 App Group corrigido com sucesso!"
