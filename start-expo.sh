#!/bin/bash

echo "🚀 Iniciando Expo Development Server..."

# Limpar cache
echo "🧹 Limpando cache..."
rm -rf .expo
rm -rf .metro

# Instalar Expo CLI localmente se não existir
echo "📦 Verificando Expo CLI..."
if [ ! -f "node_modules/.bin/expo" ]; then
    echo "📥 Instalando @expo/cli localmente..."
    npm install @expo/cli --no-save --silent
fi

# Aplicar fix do NativeBase Icons se necessário
echo "🔧 Aplicando fix do NativeBase..."
if [ -f "fix-nativebase.js" ]; then
    node fix-nativebase.js
fi

# Usar o Expo CLI local
echo "▶️ Iniciando servidor de desenvolvimento..."
echo "📱 Usando Expo CLI local..."
echo ""
echo "✅ Para conectar:"
echo "   📱 Abra o app Expo Go no seu celular"
echo "   🔗 Escaneie o QR code que aparecerá"
echo "   🆕 Google Sign-In NATIVO agora ativo!"
echo ""
./node_modules/.bin/expo start --clear