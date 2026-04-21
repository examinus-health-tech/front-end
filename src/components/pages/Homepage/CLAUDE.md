# Homepage — Dashboard principal

## Telas

| Tela | Funcao |
|------|--------|
| Homepage | Dashboard com score geral, cards de sistemas organicos, fitness, news, campanhas |
| HealthWallet | Carteira de saude — historico completo de exames |
| HeartScore | Detalhes do score cardiaco |
| UploadMain | Ponto de entrada para upload de exame (PDF ou manual) |

## Dados exibidos

A Homepage agrega dados de MULTIPLOS contexts:
- **useAuth** → nome, foto do usuario
- **useHome** → exames, fitness dashboard, news, campaigns, score geral
- **useExam** → lista de exames (para cards de sistemas organicos)
- **useMedication** → card de medicamentos (ou "Em breve" se bloqueado)

## Fitness na Homepage

- iOS: dados via HealthKit (`healthKitService`)
- Android: dados via Health Connect (`healthConnectService`)
- Ambos syncam pro backend via `fitnessService`
- Flag `DISABLE_ANDROID_HEALTH_CONNECT` no HomeContext pode desabilitar no Android
- Sync automatico quando app volta ao foreground (`AppState` listener)

## Componentes importantes

- `StatusCards` (molecule) — cards de sistemas organicos com score e cor
- `FeatureBanner` — banners de campanha
- `AnimatedCircularProgress` — circulo de score geral
- Skeleton loading via `react-content-loader`
- Pull-to-refresh via `CustomRefreshControl`

## Gotchas

- **Foto de perfil:** cacheia em base64 no user state. Se nao carregar, verificar `getUserInfo()` no AuthContext
- **Score "em analise":** exames com status pendente mostram badge ao inves de score numerico
- **Fitness no Expo Go:** nao funciona — precisa de dev client ou build nativo
- **Animacoes:** usa `react-native-reanimated` (FadeInDown, FadeInRight). Se quebrar, verificar plugin do babel
