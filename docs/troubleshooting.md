# Troubleshooting — Examinus Mobile

Guia de problemas recorrentes e suas soluções. Atualizar sempre que resolver algo novo.

---

## Build / Startup

### Projeto não inicia ou build falha após mudanças em dependências

```bash
# Nuclear clean — resolve 90% dos problemas de build
rm -rf node_modules ios/Pods ios/build android/app/build .expo
npm install
cd ios && pod install && cd ..
npx expo prebuild --clean
```

### Metro bundler travado na porta 8081

```bash
lsof -i :8081
# Pega o PID e mata:
kill -9 <PID>
# Ou direto:
npx expo start --clear
```

### iOS build falha com "signing" ou certificado

1. Abrir Xcode: `open ios/examinusmobile.xcworkspace`
2. Target > Signing & Capabilities > selecionar team manualmente
3. Se persistir, limpar derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData`

### Android build falha com Gradle

```bash
cd android && ./gradlew clean && cd ..
npx expo prebuild --clean --platform android
```

### Pods não instalam / versão incompatível (iOS)

```bash
cd ios
pod cache clean --all
pod deintegrate
pod install --repo-update
cd ..
```

---

## Dependências nativas / OTA

### HealthKit crash após atualização

**NUNCA** atualizar `@kingstinct/react-native-healthkit` ou `react-native-nitro-modules` via EAS Update (OTA). O JS novo é incompatível com o nativo antigo e causa crash silencioso.

**Solução:** essas libs SÓ podem ser atualizadas com um novo EAS Build nativo (`eas build`).

Versões atuais (seguras no nativo atual):
- `@kingstinct/react-native-healthkit`: 12.2.0
- `react-native-nitro-modules`: 0.30.2

### OneSignal — patch desaparece

O patch `onesignal-expo-plugin+2.0.3.patch` corrige o app group identifier para NSE (Notification Service Extension) no iOS. Se sumir após `npm install`:

```bash
npx patch-package
```

O `postinstall` do package.json já roda isso automaticamente, mas em caso de problema verifique se `patches/` existe e contém o arquivo.

### Conflitos de dependências de mídia (Android)

Histórico: commit `de6d145` — conflitos entre libs de mídia no Android. Solução foi reverter para managed workflow (`d961f11`).

**Regra:** ao adicionar libs de mídia/vídeo, testar build Android imediatamente. Não deixar acumular.

---

## Autenticação

### Race condition no login + OneSignal

Problema recorrente (commit `d05ccda`): OneSignal tenta registrar device antes do token estar disponível.

**Solução atual:** o `registerDeviceOnBackend` é chamado APÓS o token ser salvo no SecureStore, dentro do AuthContext.

### Vazamento de dados entre usuários

Problema (commit `b42adfb`): dados do usuário anterior apareciam após novo login.

**Solução:** no `signOut()`, limpar TODOS os storages:
- SecureStore (tokens, user data)
- AsyncStorage (dados não-sensíveis)
- Resetar todos os contexts (Home, Exam, Medication, etc.)

### Google Auth falha

Se Google Auth para de funcionar, verificar:
1. `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` no `.env`
2. SHA-1 configurado no Google Cloud Console (muda a cada novo EAS Build)
3. Testar com `npx expo run:android` (dev client), não Expo Go

### Apple Sign-In falha

Verificar:
1. Apple Sign-In capability no Xcode (Signing & Capabilities)
2. Service ID configurado no Apple Developer Portal
3. Só funciona em device real ou simulator com Apple ID logado

---

## Navegação / UI

### Splash video tela preta (Android)

Histórico: commits `d67bf45` → `c6abb5b` → `1bd9fd0`. Múltiplas tentativas até funcionar.

**Solução final:** desativar loop no vídeo, simplificar componente. Se voltar, verificar se `expo-av` está na versão compatível com o Expo SDK atual.

### Tab bar some após tela fullscreen

Telas de Medication e Notifications removem a tab bar. Ao navegar de volta, a tab bar pode não reaparecer.

**Solução:** usar `TabBarContext` para controlar visibilidade. Sempre chamar `showTabBar()` no `useFocusEffect` da tela de destino.

### Case sensitivity em imports

Problema (commit `5d33408`): import `FitnessCard` vs `fitnessCard` — funciona no macOS mas crasha no CI/Android.

**Regra:** sempre usar o nome EXATO do arquivo, respeitando maiúsculas/minúsculas.

---

## Testes

### TestIDs desatualizados quebrando testes

Problema (commit `3231d09`): 16 test suites falhando por testIDs renomeados.

**Regra:** ao renomear um testID, buscar em:
1. `__tests__/` ou `*.test.tsx` — testes unitários
2. `.maestro/flows/` — testes E2E
3. Componentes que referenciam o testID

### Mocks desatualizados após migração SecureStore

Problema (commit `4efa177`): testes usando mock de AsyncStorage quando o código migrou para SecureStore.

**Regra:** ao migrar storage, atualizar os mocks correspondentes nos testes.

---

## Variáveis de ambiente

### API não conecta

Verificar:
1. `.env` tem `EXPO_PUBLIC_API_URL` correto
2. Para dev local: `EXPO_PUBLIC_API_URL=http://localhost:5076/api/v1/`
3. Para Android emulador: usar `http://10.0.2.2:5076/api/v1/` (não `localhost`)
4. Reiniciar Metro após mudar `.env`: `npx expo start --clear`

### Variáveis não carregam

Expo só lê variáveis com prefixo `EXPO_PUBLIC_`. Sem esse prefixo, a variável não estará disponível no JS.

---

## EAS Build

### Build preview iOS (simulador)

```bash
eas build --profile preview --platform ios
```
Gera `.app` que só roda em simulador. Para device, usar `development` ou `production`.

### Build production — credenciais

Android: credenciais locais (`credentialsSource: "local"` no eas.json). Precisa ter keystore configurado.

iOS: gerenciado pelo EAS. Se der erro de provisioning profile, rodar:
```bash
eas credentials
```

---

## Comandos úteis de diagnóstico

```bash
# Ver versão de tudo
npx expo-doctor                    # Checa compatibilidade de deps
npx expo config --type public      # Ver config final resolvida
npx react-native info              # Info do ambiente RN

# Simulador iOS
xcrun simctl list devices           # Listar simuladores
xcrun simctl erase <UDID>          # Reset completo do simulador

# Emulador Android
adb devices                         # Listar devices
adb reverse tcp:5076 tcp:5076      # Redirecionar porta da API pro emulador
adb logcat *:E                     # Ver logs de erro do Android
```
