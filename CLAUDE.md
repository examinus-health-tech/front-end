# Examinus Mobile - CLAUDE.md

## Sobre o projeto

App mobile de saúde (Examinus Health) que permite upload e análise de exames laboratoriais por IA, tracking de fitness (HealthKit/Health Connect), gerenciamento de medicamentos e análises diárias de saúde.

## Stack

- **Framework:** React Native 0.79.6 + Expo SDK 53 + TypeScript 5.8
- **Navegação:** React Navigation 6 (native-stack + bottom-tabs)
- **State:** Context API (sem Redux/Zustand)
- **UI:** NativeBase 3 + Styled Components 6
- **Forms:** React Hook Form + Yup
- **HTTP:** Axios com interceptors (token refresh, error handling)
- **Push:** OneSignal + expo-notifications (local)
- **Auth:** Google Sign-In, Apple Auth, Biométrica (Face ID/Touch ID)
- **Saúde:** @kingstinct/react-native-healthkit v12, react-native-health-connect
- **Testes:** Jest (jest-expo) + @testing-library/react-native
- **Observabilidade:** Sentry (@sentry/react-native)
- **Build:** EAS (Expo Application Services), Metro com SVG transformer

## Arquitetura

```
src/
├── assets/           # Fonts (Poligon), ícones SVG, imagens PNG
├── components/
│   ├── atoms/        # Button, Text, ResponsiveImage, RangeTab
│   ├── molecules/    # FeatureBanner, cards compostos
│   ├── organisms/    # Componentes complexos (listas, forms)
│   ├── pages/        # Telas completas por feature
│   │   ├── Exam/
│   │   ├── Homepage/
│   │   ├── Login/
│   │   ├── Medication/
│   │   ├── Settings/
│   │   ├── Tracker/
│   │   └── ...
│   └── ErrorBoundary.tsx
├── contexts/         # AuthContext, ExamContext, MedicationContext, etc.
├── hooks/            # useAuth, useMedication, useErrorHandler, etc.
├── routes/           # app.routes.tsx (Tab Navigator + Stacks)
├── services/         # API clients, analytics, fitness, medication, etc.
├── storage/          # AsyncStorage wrappers (token, user, config)
├── utils/            # AppErrors, debugLogger, formatters
├── dtos/             # Types/interfaces para dados da API
├── config/           # Deep linking config
└── theme/            # NativeBase theme customization
```

## Comandos

```bash
npm start              # Expo dev server
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm run type-check     # tsc --noEmit
npm run lint           # ESLint
npm run lint:fix       # ESLint com auto-fix
npm run check-all      # type-check + lint
npm test               # Jest (unit tests)
npm run test:watch     # Jest em watch mode
npm run test:coverage  # Jest com cobertura
npm run e2e            # Maestro E2E tests (todos os fluxos)
npm run e2e:flow <file># Maestro E2E test (fluxo específico)
npm run e2e:record     # Gravar novo fluxo E2E
npm run e2e:studio     # Maestro Studio (visual editor)
```

## Convenções

### Commits
Conventional Commits com commitlint. Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

### Código
- **Prettier:** single quotes, bracket spacing, 120 char width
- **ESLint:** TS strict off, warn em any/unused vars
- **Linguagem:** Mensagens de UI e comentários em **português brasileiro**
- **Imports:** Path aliases via babel module-resolver (`@components/*`, `@services/*`, `@hooks/*`, `@contexts/*`, `@utils/*`, `@assets/*`, `@storage/*`, `@dtos/*`, `@routes/*`)

### Branches
- `develop` é a branch principal (base para PRs)
- Feature branches: `feat/<nome>`
- Fix branches: `fix/<nome>`

### Testes unitários (Jest)
- Arquivos de teste junto ao código: `Component.test.tsx` ou `service.test.ts`
- Mocks em `__mocks__/` na raiz
- Testar: hooks, services, utils, componentes críticos
- Não mockar AsyncStorage nos testes de integração

### Testes E2E (Maestro)
- Fluxos em `.maestro/flows/` (YAML)
- Rodam no simulador/emulador com o app real
- Variáveis de ambiente: `EMAIL` e `PASSWORD` para login
- Executar: `npm run e2e` (todos) ou `npm run e2e:flow .maestro/flows/02_login_email.yaml` (específico)
- Gravar novo: `npm run e2e:record`

## API

- Base URL via `EXPO_PUBLIC_API_URL` (env var)
- Auth: Bearer token (JWT) via AsyncStorage
- Interceptor automático de token refresh e logout em 401
- Timeout: 30s

## Observabilidade

- **Sentry:** Crash reporting, performance monitoring, breadcrumbs automáticos (navegação, HTTP, user actions)
- **ErrorBoundary:** Wraps toda a app, reporta ao Sentry
- **Analytics:** Custom service com event buffering (batch de 20 eventos / 10s)
- **DebugLogger:** Logging contextualizado (apenas dev)

## Notas importantes

- `app.json` usa `jsEngine: "jsc"` (não Hermes)
- Deep linking: `examinus://`, `https://examinus.app`
- OneSignal ID é inicializado no top-level do App.tsx (antes de qualquer import de componente)
- Splash screen mínima de 6 segundos
- EAS Updates habilitado com `runtimeVersion` policy `appVersion`
- Zoho PageSense configurado via `ZPS_APP_ID` no iOS infoPlist
