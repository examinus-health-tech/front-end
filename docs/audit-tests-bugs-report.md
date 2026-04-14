# Auditoria de Testes - Bugs Validados como Corretos

**Data:** 2026-03-26
**Branch:** feat/tests-and-testids
**Total:** 70 issues encontradas em 6 areas

## CRITICAL (6)

| # | Area | Issue | Teste valida? |
|---|------|-------|---------------|
| 1 | Upload | Sem validacao de tipo/tamanho de arquivo (aceita .exe, .xyz) | SIM |
| 2 | API | Sem token refresh antes de logout forcado no 401 | SIM |
| 3 | Storage | Token em AsyncStorage (sem criptografia) - 2 keys diferentes | SIM (corrigido fix/security-audit) |
| 4 | Storage | Token + email logados no console | SIM (corrigido fix/security-audit) |
| 5 | Auth | Token lido de @app:user ao inves do modulo dedicado | SIM |
| 6 | Auth | deleteAccount limpa keys erradas (AsyncStorage vs SecureStore) | SIM |

## HIGH (19)

| # | Area | Issue |
|---|------|-------|
| 7 | API | withCredentials: true forcado globalmente (CSRF) |
| 8 | API | Mensagens de erro do backend expostas ao usuario |
| 9 | Auth | Apple sign-in/sign-up omite email dos dados salvos |
| 10 | Auth | Biometric login aceita token sem validacao |
| 11 | Auth | Token corrupto/sem exp tratado como valido |
| 12 | Login | User enumeration no ForgotPassword ("email nao encontrado") |
| 13 | Login | Sem rate limiting em login/reset |
| 14 | Signup | Senha aceita so min 8 sem complexidade (diferente do PasswordConfig) |
| 15 | OAuth | Google OAuth sem nonce/state |
| 16 | OAuth | Apple Sign In sem nonce |
| 17 | Upload | validateStatus: () => true - controle de fluxo confuso |
| 18 | Exam | .replace() em propriedades potencialmente null - crash |
| 19 | Exam | getExamList sem validacao de resposta null |
| 20 | ExamList | Erro engolido silenciosamente - loading infinito |
| 21 | HealthWallet | useEffect dentro de funcao nao-componente (viola Rules of Hooks) |
| 22 | Info | Data de nascimento invalida aceita (31/02) |
| 23 | Info | useEffect com user no deps causa re-render infinito |
| 24 | MyAccount | Fluxos de signOut e deleteAccount sem testes |
| 25 | Services | validateStatus aceita todos 4xx silenciosamente |

## MEDIUM (30)

| # | Area | Issue |
|---|------|-------|
| 26 | API | Token parcial (30 chars) logado |
| 27 | API | Interceptor engole erros de auth silenciosamente |
| 28 | API | 401 em rotas auth - teste fraco, possivel leak |
| 29 | API | Headers/body/token logados verbosamente |
| 30 | Auth | signIn crash se API retorna body vazio |
| 31 | Auth | Token sem exp passa validacao local |
| 32 | Homepage | Score 0 mostra "?" (inconsistente com HealthWallet "0") |
| 33 | Homepage | Boundary mismatch entre getScoreText e getScoreColor |
| 34 | Homepage | Sem sanitizacao de dados de saude da API |
| 35 | HealthWallet | Score 0 inconsistente com Homepage |
| 36 | Upload | Sucesso silencioso quando API retorna null |
| 37 | Upload | Email enviado como HTTP header |
| 38 | Exam | getCorrectedColor sobrescreve decisao do backend |
| 39 | Exam | Missing key prop no map |
| 40 | Exam | useEffect com dependency array incompleto |
| 41 | ExamList | ProcessingTimeout categorizado inconsistentemente |
| 42 | ExamList | Filtro de data aceita datas invalidas |
| 43 | Services | getDailyLogByDate engole erros 500 |
| 44 | Services | Goal cache nao invalidado quando backend falha |
| 45 | Services | Date format inconsistente HealthKit vs Health Connect |
| 46 | Services | Race condition no Health Connect init |
| 47 | Signup | Erro "email ja em uso" revela existencia |
| 48 | Code | OTP aceita caracteres nao-numericos |
| 49 | Code | Resend e stub (nao implementado) |
| 50 | Code | Sem limite de tentativas no OTP |
| 51 | Onboarding | Dados de saude em AsyncStorage sem criptografia |
| 52 | Onboarding | Upload sem validacao de tamanho/nome |
| 53 | Biometric | Email enviado em plaintext para API |
| 54 | HomeContext | Sleep rounding perde precisao (89min = 1h) |
| 55 | HomeContext | Testes com assertions condicionais que pulam silenciosamente |

## LOW (15)

| # | Area | Issue |
|---|------|-------|
| 56 | API | failedQueue/isRefreshing dead code |
| 57 | API | testConnection testes sao no-ops |
| 58 | Storage | storageUserGet retorna {} ao inves de null |
| 59 | Services | getDailyLogsHistory/getSleepHistory engole erros |
| 60 | Services | markAsReviewed engole erros de escrita |
| 61 | Biometric | Device ID fallback previsivel (timestamp) |
| 62 | OAuth | Google Client IDs hardcoded no source |
| 63 | Signup | Sem sanitizacao de input |
| 64 | MyAccount | Typo "e irreversivel" (deveria ser "e irreversivel") |
| 65 | MyAccount | Delete feedback logado mas nao enviado ao backend |
| 66 | Notifications | Subtitulos identicos em todos os 4 cards (copy-paste) |
| 67 | HealthWallet | Missing key prop no map de systems |
| 68 | HealthWallet | getColorByScore retorna undefined para scores negativos |
| 69 | Bonus | Clipboard.setString deprecated |
| 70 | Exam | setTimeout memory leak no unmount |

## Prioridade de Correcao

### Agora
- #1 validacao upload
- #6 deleteAccount keys erradas
- #9 Apple sem email
- #18 crash null replace

### Esta semana
- #2 token refresh
- #12 user enumeration
- #14 senha fraca signup
- #20 loading infinito
- #21 hooks violation

### Proximo sprint
- #15/#16 OAuth nonce
- #8 erro backend exposto
- #22/#23 info form
