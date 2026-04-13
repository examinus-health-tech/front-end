# Cenarios de Teste Manual — Examinus Mobile

> Data de criacao: 2026-04-10
> Atualizado: 2026-04-13
> Objetivo: Validar todas as funcionalidades do app manualmente
> Legenda: [ ] pendente | [x] ok | [!] bug encontrado | [E2E] coberto por automacao Maestro
>
> **Cobertura E2E:** 50 flows Maestro cobrem ~85 cenarios. Cenarios marcados com [E2E] ja sao validados automaticamente.
> Para rodar: `maestro test -e EMAIL="..." -e PASSWORD="..." .maestro/flows/<flow>.yaml`

---

## 1. AUTENTICACAO

### 1.1 Tela de Boas-Vindas (Welcome)

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 1.1.1 | Exibicao da splash screen | Abrir o app pela primeira vez | Splash screen aparece e transiciona para a tela de boas-vindas | [E2E] flow 00, 01 |
| 1.1.2 | Carrossel de onboarding | Deslizar para a direita nas telas Simplify, Health, StayCalm | As 3 telas de introducao sao exibidas em sequencia com animacao | [ ] |
| 1.1.3 | Botao "Iniciar" | Tocar no botao "Iniciar" na tela de boas-vindas | Navega para a tela de login | [E2E] flow 01 |

### 1.2 Login com Email/Senha

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 1.2.1 | Login com credenciais validas | Inserir email e senha corretos e tocar em "Entrar" | Login realizado, navega para Homepage | [E2E] flow 02 |
| 1.2.2 | Login com email invalido | Inserir email com formato invalido (ex: "abc") | Mensagem de erro de validacao no campo email | [E2E] flow 03 |
| 1.2.3 | Login com senha incorreta | Inserir email correto e senha errada | Mensagem de erro "Credenciais invalidas" ou similar | [E2E] flow 32 |
| 1.2.4 | Login com campos vazios | Tocar em "Entrar" sem preencher nada | Mensagens de validacao nos campos obrigatorios | [E2E] flow 03 |
| 1.2.5 | Visibilidade da senha | Tocar no icone de olho no campo de senha | Alterna entre exibir e ocultar a senha | [ ] |
| 1.2.6 | Persistencia de sessao | Fazer login, fechar e reabrir o app | Usuario permanece logado (token valido) | [ ] |

### 1.3 Login Social

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 1.3.1 | Login com Google | Tocar em "Entrar com Google" | Abre tela do Google, autentica, redireciona ao app logado | [ ] MANUAL (OAuth) |
| 1.3.2 | Login com Apple (iOS) | Tocar em "Entrar com Apple" | Abre Face ID / tela Apple, autentica, redireciona ao app logado | [ ] MANUAL (OAuth) |
| 1.3.3 | Cancelar login Google | Iniciar login Google e cancelar | Retorna a tela de login sem erros | [ ] MANUAL (OAuth) |
| 1.3.4 | Cancelar login Apple | Iniciar login Apple e cancelar | Retorna a tela de login sem erros | [ ] MANUAL (OAuth) |

### 1.4 Login Biometrico

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 1.4.1 | Login com biometria (Face ID / Fingerprint) | Ter biometria configurada, abrir app | Prompt biometrico aparece, autenticacao com sucesso leva ao app | [ ] MANUAL (sensor) |
| 1.4.2 | Biometria falha | Falhar na autenticacao biometrica | Oferece alternativa (digitar senha) | [ ] MANUAL (sensor) |
| 1.4.3 | Biometria desativada | Ter biometria desativada nas config do app | App mostra tela de login normal (email/senha) | [ ] MANUAL (sensor) |

### 1.5 Cadastro (Sign Up)

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 1.5.1 | Cadastro com dados validos | Preencher nome, email, senha e confirmacao | Conta criada, navega para onboarding ou home | [ ] |
| 1.5.2 | Cadastro com email ja existente | Usar email que ja tem conta | Mensagem de erro informando que email ja esta em uso | [ ] |
| 1.5.3 | Senha fraca | Inserir senha simples (ex: "123") | Mensagem de validacao exigindo senha mais forte | [E2E] flow 33 |
| 1.5.4 | Senhas nao conferem | Senha e confirmacao diferentes | Mensagem de erro "Senhas nao conferem" | [E2E] flow 33 |
| 1.5.5 | Campos vazios | Tentar cadastrar sem preencher campos | Validacao nos campos obrigatorios | [E2E] flow 04 |

### 1.6 Recuperacao de Senha

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 1.6.1 | Solicitar recuperacao | Tocar em "Esqueci a senha", inserir email valido | Mensagem de confirmacao de envio do codigo | [E2E] flow 34 |
| 1.6.2 | Email nao cadastrado | Inserir email que nao existe | Mensagem de erro ou aviso adequado | [ ] |
| 1.6.3 | Inserir codigo de verificacao | Digitar o codigo recebido por email | Navega para tela de nova senha | [ ] MANUAL (email) |
| 1.6.4 | Codigo incorreto | Digitar codigo errado | Mensagem de erro "Codigo invalido" | [ ] MANUAL (email) |
| 1.6.5 | Definir nova senha | Preencher nova senha e confirmacao | Senha alterada com sucesso, navega para login | [ ] MANUAL (email) |

### 1.7 Logout

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 1.7.1 | Logout padrao | Ir em Configuracoes > Sair | Sessao encerrada, navega para tela de login | [E2E] flow 16 |
| 1.7.2 | Estado apos logout | Apos logout, reabrir o app | App exibe tela de login, nao a homepage | [E2E] flow 46 |

---

## 2. ONBOARDING (Primeiro Acesso)

### 2.1 Fluxo de Onboarding

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 2.1.1 | Selecao de genero | Selecionar Masculino ou Feminino | Opcao marcada, botao "Proximo" habilitado | [E2E] flow 18 |
| 2.1.2 | Inserir peso | Digitar peso em kg | Valor aceito, validacao de range razoavel | [E2E] flow 18 |
| 2.1.3 | Inserir altura | Digitar altura (cm ou m) | Conversao automatica cm/m funciona corretamente | [E2E] flow 18 |
| 2.1.4 | Inserir idade | Digitar idade | Valor aceito com validacao (ex: 1-120) | [E2E] flow 18 |
| 2.1.5 | Nivel de atividade fisica | Selecionar nivel de atividade | Opcao marcada corretamente | [E2E] flow 18 |
| 2.1.6 | Humor atual | Selecionar estado emocional | Opcao registrada | [E2E] flow 18 |
| 2.1.7 | Habitos de vida | Selecionar habitos | Opcoes marcadas | [E2E] flow 18 |
| 2.1.8 | Upload de exame inicial | Fazer upload de PDF ou imagem de exame | Arquivo enviado e processado com sucesso | [ ] |
| 2.1.9 | Pular upload de exame | Pular etapa de upload | Onboarding finalizado sem exame | [ ] |
| 2.1.10 | Navegacao entre etapas | Tocar em "Voltar" durante o onboarding | Retorna a etapa anterior com dados preservados | [ ] |
| 2.1.11 | Barra de progresso | Avancar pelas 8 etapas | Indicador de progresso atualiza corretamente | [ ] |

---

## 3. HOMEPAGE (Dashboard)

### 3.1 Exibicao do Dashboard

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 3.1.1 | Carregamento inicial | Fazer login e chegar na homepage | Dashboard carrega com dados do usuario (saudacao, cards) | [E2E] flow 06 |
| 3.1.2 | Saudacao personalizada | Observar o cabecalho | Exibe nome do usuario e saudacao contextual (bom dia/tarde/noite) | [E2E] flow 06, 36 |
| 3.1.3 | Cards de resumo | Verificar cards na homepage | Cards de exames, medicamentos, fitness visíveis | [E2E] flow 06 |
| 3.1.4 | Pull to refresh | Puxar a tela para baixo | Dados atualizam e indicador de loading aparece | [E2E] flow 36 |
| 3.1.5 | Navegacao pelos cards | Tocar nos cards de resumo | Navega para a tela correspondente (exames, medicamentos, etc.) | [E2E] flow 35 |
| 3.1.6 | Carrossel de noticias/dicas | Deslizar carrossel de dicas de saude | Carrossel funciona com transicoes suaves | [ ] |
| 3.1.7 | Lembrete de medicamento | Ter medicamento ativo com horario proximo | Card de lembrete aparece na homepage | [ ] |

---

## 4. EXAMES

### 4.1 Lista de Exames

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 4.1.1 | Exibir lista de exames | Navegar para aba "Exames" | Lista de exames carregada ordenada por data | [E2E] flow 07 |
| 4.1.2 | Lista vazia | Conta sem exames | Mensagem de "Nenhum exame encontrado" com opcao de upload | [ ] |
| 4.1.3 | Busca por exame | Usar campo de busca/filtro | Resultados filtrados corretamente | [ ] |
| 4.1.4 | Scroll da lista | Lista com muitos exames, fazer scroll | Scroll suave, sem travamentos | [ ] |

### 4.2 Detalhe do Exame

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 4.2.1 | Visualizar detalhe | Tocar em um exame da lista | Tela de detalhe abre com todos os dados do exame | [E2E] flow 19 |
| 4.2.2 | Metadados do exame | Verificar cabecalho do detalhe | Data, laboratorio, medico exibidos corretamente | [E2E] flow 37 |
| 4.2.3 | Itens do exame | Verificar lista de resultados | Cada item mostra nome, valor, referencia e indicador de cor | [E2E] flow 37 |
| 4.2.4 | Indicadores de score | Verificar cores dos resultados | Verde (normal), amarelo (atencao), vermelho (alterado) | [E2E] flow 37 |
| 4.2.5 | Sistemas organicos | Verificar breakdown por sistema | Scores por sistema organico exibidos corretamente | [E2E] flow 37 |
| 4.2.6 | Recomendacoes | Verificar secao de recomendacoes | Recomendacoes de saude baseadas nos resultados | [ ] |

### 4.3 Exclusao de Exame

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 4.3.1 | Deletar exame | Tocar em opcao de deletar no detalhe do exame | Confirmacao solicitada antes de deletar | [ ] |
| 4.3.2 | Confirmar exclusao | Confirmar exclusao do exame | Exame removido, lista atualizada | [ ] |
| 4.3.3 | Cancelar exclusao | Cancelar no dialogo de confirmacao | Exame permanece na lista | [ ] |

---

## 5. UPLOAD DE EXAMES

### 5.1 Fluxo de Upload

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 5.1.1 | Abrir opcoes de upload | Tocar na aba central "Upload" | Bottom sheet com opcoes de upload aparece | [E2E] flow 38 |
| 5.1.2 | Upload de PDF | Selecionar "PDF", escolher arquivo | Arquivo enviado, progresso exibido, resultado processado | [E2E] flow 13 |
| 5.1.3 | Upload de imagem (galeria) | Selecionar "Imagem", escolher da galeria | Imagem enviada e processada com sucesso | [ ] |
| 5.1.4 | Upload via camera | Selecionar "Camera", tirar foto | Foto capturada e enviada para processamento | [ ] MANUAL (camera) |
| 5.1.5 | Entrada manual | Selecionar "Entrada manual" | Formulario de dados do exame aparece | [ ] |
| 5.1.6 | Preencher entrada manual | Preencher formulario manual com dados do exame | Dados salvos e exame criado com sucesso | [ ] |
| 5.1.7 | Arquivo invalido | Tentar enviar arquivo que nao e exame | Mensagem de erro apropriada | [ ] |
| 5.1.8 | Progresso do upload | Durante upload, observar estados | Loading, processando, sucesso/erro exibidos corretamente | [ ] |
| 5.1.9 | Score warning | Upload de exame com resultados preocupantes | Alerta de score warning exibido ao usuario | [ ] |
| 5.1.10 | Cancelar upload | Iniciar upload e cancelar | Upload interrompido, estado limpo | [ ] |

---

## 6. CARTEIRA DE SAUDE (Health Wallet)

### 6.1 Funcionalidades

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 6.1.1 | Exibir carteira de saude | Navegar para aba "Carteira de Saude" | Tela carrega com historico de exames e scores | [E2E] flow 17, 39 |
| 6.1.2 | Tendencia de scores | Verificar graficos de tendencia | Evolucao dos scores ao longo do tempo | [E2E] flow 39 |
| 6.1.3 | Breakdown por sistema | Verificar detalhamento por sistema organico | Cada sistema com score e historico | [E2E] flow 39 |
| 6.1.4 | Carteira vazia | Conta sem exames | Mensagem adequada com sugestao de upload | [ ] |

### 6.2 Heart Score

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 6.2.1 | Visualizar heart score | Navegar para Heart Score | Score cardiovascular exibido com detalhes | [E2E] flow 29 |
| 6.2.2 | Scores por sistema organico | Verificar breakdown | Cada sistema organico com score individual e cor | [E2E] flow 40 |
| 6.2.3 | Analise detalhada | Tocar em um sistema para detalhes | Informacoes detalhadas do sistema exibidas | [E2E] flow 40 |

---

## 7. MEDICAMENTOS

### 7.1 Timeline de Medicamentos

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 7.1.1 | Exibir timeline | Navegar para secao de medicamentos | Lista de medicamentos ativos com horarios do dia | [E2E] flow 30 |
| 7.1.2 | Timeline vazia | Sem medicamentos cadastrados | Mensagem "Nenhum medicamento" com botao de adicionar | [ ] |
| 7.1.3 | Proximo horario | Ter medicamento com horario futuro hoje | Card destaca proximo medicamento a tomar | [ ] |

### 7.2 Adicionar Medicamento

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 7.2.1 | Preencher formulario completo | Nome, dosagem, forma, frequencia, horarios | Todos os campos aceitos e validados | [E2E] flow 30 |
| 7.2.2 | Selecao de forma | Escolher entre pilula, gotas, injecao, pomada, capsula, xarope | Opcao selecionada com icone correto | [ ] |
| 7.2.3 | Frequencia diaria | Selecionar "Todos os dias" | Campo de horarios habilitado | [ ] |
| 7.2.4 | Frequencia em dias especificos | Selecionar dias da semana | Somente os dias selecionados recebem lembretes | [ ] |
| 7.2.5 | Frequencia por intervalo | Selecionar "A cada X horas" | Horarios calculados automaticamente | [ ] |
| 7.2.6 | Multiplos horarios | Adicionar mais de um horario por dia | Todos os horarios salvos | [ ] |
| 7.2.7 | Duracao e quantidade | Definir duracao do tratamento e quantidade restante | Dados salvos corretamente | [ ] |
| 7.2.8 | Alerta de recarga | Configurar alerta de recarga | Notificacao programada para quando estoque estiver baixo | [ ] |
| 7.2.9 | Salvar medicamento | Tocar em "Salvar" | Medicamento criado, aparece na timeline | [E2E] flow 30 |
| 7.2.10 | Validacao de campos obrigatorios | Tentar salvar sem nome ou dosagem | Mensagens de validacao nos campos | [E2E] flow 41 |

### 7.3 Editar Medicamento

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 7.3.1 | Abrir edicao | Tocar em medicamento > editar | Formulario abre com dados preenchidos | [E2E] flow 43 |
| 7.3.2 | Alterar dados | Modificar dosagem, horario ou frequencia | Dados atualizados, notificacoes reagendadas | [ ] |
| 7.3.3 | Desativar medicamento | Opcao de desativar/remover | Medicamento removido da timeline ativa | [E2E] flow 30 |

### 7.4 Registro de Dose

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 7.4.1 | Marcar como tomado | Tocar em "Tomei" no horario do medicamento | Dose registrada como tomada com timestamp | [E2E] flow 42 |
| 7.4.2 | Pular dose | Tocar em "Pular" | Dose registrada como pulada | [E2E] flow 42 |
| 7.4.3 | Dose perdida | Horario passar sem acao | Status muda para "perdida" automaticamente | [ ] |
| 7.4.4 | Feedback visual | Apos registrar dose | Card muda de estado visualmente (cor, icone) | [ ] |

### 7.5 Aderencia

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 7.5.1 | Visualizar aderencia | Navegar para tela de aderencia | Porcentagem mensal de aderencia exibida | [E2E] flow 31 |
| 7.5.2 | Historico mensal | Navegar entre meses | Aderencia por mes com breakdown tomado/pulado/perdido | [E2E] flow 31 |
| 7.5.3 | Aderencia 100% | Todas doses tomadas no mes | Indicador de 100% e feedback positivo | [ ] |

### 7.6 Notificacoes de Medicamento

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 7.6.1 | Receber lembrete | Ter medicamento com horario proximo | Push notification no horario configurado | [ ] MANUAL (push) |
| 7.6.2 | Multiplos lembretes no dia | Medicamento com 3 horarios | 3 notificacoes distintas nos horarios corretos | [ ] MANUAL (push) |
| 7.6.3 | Cancelamento ao desativar | Desativar medicamento | Notificacoes futuras canceladas | [ ] MANUAL (push) |

---

## 8. TRACKER (Fitness)

### 8.1 Dashboard de Fitness

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 8.1.1 | Exibir dashboard | Navegar para secao de Tracker | Cards de metricas (passos, peso, calorias, etc.) visiveis | [E2E] flow 10 |
| 8.1.2 | Sincronizar com HealthKit (iOS) | Permitir acesso ao HealthKit | Dados de saude importados e exibidos | [ ] MANUAL (HealthKit) |
| 8.1.3 | Sincronizar com Health Connect (Android) | Permitir acesso ao Health Connect | Dados de saude importados e exibidos | [ ] MANUAL (Health Connect) |
| 8.1.4 | Sem permissao de saude | Negar acesso ao HealthKit/Health Connect | App funciona sem dados nativos, permite entrada manual | [ ] MANUAL (permissao) |

### 8.2 Passos

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 8.2.1 | Visualizar contagem de passos | Abrir detalhe de Passos | Contagem do dia atual com progresso vs meta | [E2E] flow 26 |
| 8.2.2 | Editar meta de passos | Alterar meta diaria | Meta atualizada, barra de progresso recalculada | [ ] |
| 8.2.3 | Historico de passos | Verificar historico | Dados dos dias anteriores exibidos | [ ] |

### 8.3 Peso

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 8.3.1 | Registrar peso | Inserir peso atual | Peso salvo com data | [E2E] flow 27 (navega) |
| 8.3.2 | Meta de peso | Definir peso meta | Meta exibida com progresso | [ ] |
| 8.3.3 | Grafico de evolucao | Verificar grafico | Tendencia de peso ao longo do tempo | [ ] |

### 8.4 Calorias

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 8.4.1 | Visualizar calorias | Abrir detalhe de Calorias | Calorias consumidas/queimadas do dia | [E2E] flow 27 |
| 8.4.2 | Meta de calorias | Verificar meta diaria | Meta exibida com progresso | [ ] |

### 8.5 Nutricao

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 8.5.1 | Visualizar macros | Abrir detalhe de Nutricao | Breakdown de proteinas, carboidratos, gorduras | [E2E] flow 27 |

### 8.6 Hidratacao

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 8.6.1 | Registrar agua | Registrar ingestao de agua | Quantidade registrada, progresso atualizado | [E2E] flow 27 (navega) |
| 8.6.2 | Meta de hidratacao | Verificar meta diaria | Meta vs consumo exibidos | [ ] |

### 8.7 Sono

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 8.7.1 | Visualizar sono | Abrir detalhe de Sono | Duracao e qualidade do sono | [E2E] flow 27 |
| 8.7.2 | Meta de sono | Verificar meta | Horas dormidas vs meta | [ ] |

### 8.8 Metas Inteligentes (Smart Goals)

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 8.8.1 | Sugestoes de metas | Acessar Smart Goals | Sugestoes baseadas no perfil e historico | [ ] |
| 8.8.2 | Personalizar meta | Editar uma meta sugerida | Meta customizada e salva | [ ] |

---

## 9. SAUDE MENTAL

### 9.1 Avaliacao DASS-21

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 9.1.1 | Iniciar avaliacao | Acessar secao de Saude Mental | Formulario com 21 perguntas carregado | [E2E] flow 15, 51 |
| 9.1.2 | Responder todas as perguntas | Selecionar resposta para cada pergunta (escala 0-3) | Cada pergunta registra selecao | [ ] |
| 9.1.3 | Navegacao entre perguntas | Avancar e voltar entre perguntas | Estado preservado ao navegar | [E2E] flow 51 |
| 9.1.4 | Enviar avaliacao incompleta | Tentar enviar sem responder tudo | Mensagem indicando perguntas faltantes | [ ] |
| 9.1.5 | Enviar avaliacao completa | Responder 21 perguntas e enviar | Resultado calculado e exibido | [ ] |

### 9.2 Resultado da Avaliacao

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 9.2.1 | Scores por dominio | Verificar resultado | Scores de Depressao, Ansiedade e Estresse exibidos | [E2E] flow 21 |
| 9.2.2 | Classificacao | Verificar nivel | Classificacao de Normal a Extremamente Severo | [ ] |
| 9.2.3 | Historico de avaliacoes | Verificar avaliacoes anteriores | Lista de resultados passados com datas | [ ] |
| 9.2.4 | Recomendacoes | Verificar secao de recomendacoes | Sugestoes baseadas no resultado | [ ] |

---

## 10. NOTIFICACOES

### 10.1 Central de Notificacoes

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 10.1.1 | Exibir notificacoes | Navegar para tela de Notificacoes | Lista de notificacoes agrupadas por periodo | [E2E] flow 12, 49 |
| 10.1.2 | Agrupamento temporal | Verificar agrupamento | Grupos: Hoje, Ontem, Ultima Semana, Este Mes | [E2E] flow 49 |
| 10.1.3 | Lista vazia | Sem notificacoes | Mensagem "Nenhuma notificacao" | [E2E] flow 49 |
| 10.1.4 | Marcar como lida | Tocar em notificacao nao lida | Notificacao marcada como lida (visual muda) | [ ] |
| 10.1.5 | Deletar notificacao | Deslizar ou usar opcao de deletar | Notificacao removida da lista | [ ] |
| 10.1.6 | Deep link da notificacao | Tocar em notificacao de medicamento | Navega para a tela correspondente (medicamento, exame, etc.) | [ ] |

### 10.2 Push Notifications

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 10.2.1 | Receber push com app em background | Enviar push via OneSignal | Notificacao aparece no sistema | [ ] MANUAL (push) |
| 10.2.2 | Receber push com app em foreground | Enviar push com app aberto | Banner ou toast de notificacao no app | [ ] MANUAL (push) |
| 10.2.3 | Tocar na push notification | Tocar na notificacao no sistema | App abre na tela correta via deep link | [ ] MANUAL (push) |

---

## 11. CONFIGURACOES

### 11.1 Tela Principal de Configuracoes

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 11.1.1 | Exibir menu de configuracoes | Navegar para aba "Minha Conta" | Lista de opcoes de configuracao visivel | [E2E] flow 11 |
| 11.1.2 | Foto do perfil | Verificar foto do usuario | Foto exibida ou avatar padrao | [E2E] flow 47 |
| 11.1.3 | Informacoes do usuario | Verificar nome e email | Dados corretos exibidos | [E2E] flow 47 |

### 11.2 Minha Conta / Informacoes Pessoais

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 11.2.1 | Visualizar dados pessoais | Abrir "Informacoes Pessoais" | Nome, email, telefone exibidos | [E2E] flow 47 |
| 11.2.2 | Alterar foto de perfil | Trocar foto de perfil | Nova foto enviada e exibida | [ ] |
| 11.2.3 | Editar informacoes | Modificar dados pessoais | Dados atualizados com sucesso | [ ] |

### 11.3 Seguranca

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 11.3.1 | Alterar senha | Inserir senha atual e nova | Senha alterada com sucesso | [ ] |
| 11.3.2 | Validacao de senha | Inserir senha atual incorreta | Mensagem de erro | [ ] |
| 11.3.3 | Ativar/desativar biometria | Toggle de biometria | Biometria habilitada/desabilitada | [ ] MANUAL (sensor) |
| 11.3.4 | Configurar 2FA (OTP) | Ativar autenticacao de dois fatores | QR code ou configuracao OTP exibida | [ ] MANUAL (OTP) |
| 11.3.5 | Verificar OTP | Inserir codigo OTP | Codigo validado, 2FA ativado | [ ] MANUAL (OTP) |

### 11.4 Notificacoes (Preferencias)

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 11.4.1 | Visualizar preferencias | Abrir "Notificacoes" em config | Toggles de categorias de notificacao | [E2E] flow 28 |
| 11.4.2 | Desativar categoria | Desligar toggle de uma categoria | Notificacoes daquela categoria cessam | [ ] |
| 11.4.3 | Reativar categoria | Religar toggle | Notificacoes retomam | [ ] |

### 11.5 Preferencias

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 11.5.1 | Alterar idioma | Selecionar idioma diferente | Interface traduzida (se suportado) | [ ] |
| 11.5.2 | Alterar tema | Selecionar modo escuro/claro (se suportado) | Tema aplicado | [ ] |
| 11.5.3 | Unidades de medida | Alterar sistema de unidades | Valores no app refletem nova unidade | [ ] |

### 11.6 Sobre Nos

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 11.6.1 | Versao do app | Verificar versao exibida | Versao e build number corretos | [E2E] flow 48 |
| 11.6.2 | Links legais | Tocar em Termos de Uso / Politica de Privacidade | Links abrem corretamente (browser ou in-app) | [E2E] flow 48 |

### 11.7 Fale Conosco

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 11.7.1 | Formulario de contato | Preencher e enviar formulario | Mensagem enviada com confirmacao | [E2E] flow 50 (navega) |
| 11.7.2 | Campos obrigatorios | Enviar sem preencher campos | Validacao nos campos obrigatorios | [ ] |

### 11.8 Bonus / Recompensas

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 11.8.1 | Visualizar bonus | Abrir secao de Bonus | Conquistas e recompensas exibidas | [E2E] flow 25 |
| 11.8.2 | Progresso de conquistas | Verificar conquistas em andamento | Progresso exibido corretamente | [ ] |

### 11.9 Exclusao de Conta

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 11.9.1 | Solicitar exclusao | Iniciar processo de exclusao de conta | Confirmacao e aviso de consequencias exibidos | [ ] |
| 11.9.2 | Confirmar exclusao | Confirmar exclusao | Conta excluida, usuario deslogado | [ ] |
| 11.9.3 | Cancelar exclusao | Cancelar no dialogo | Conta mantida | [ ] |

---

## 12. NAVEGACAO E UX GERAL

### 12.1 Tab Bar

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 12.1.1 | Navegacao entre abas | Tocar em cada aba (Home, Exames, Upload, Carteira, Conta) | Tela correta carrega para cada aba | [E2E] flow 44 |
| 12.1.2 | Aba ativa destacada | Verificar indicador visual | Aba atual com destaque visual (cor, icone) | [E2E] flow 44 |
| 12.1.3 | Botao central de upload | Tocar no botao central | Bottom sheet de upload aparece | [E2E] flow 44, 38 |
| 12.1.4 | Ocultar tab bar | Entrar em tela fullscreen (ex: detalhe de medicamento) | Tab bar some | [ ] |
| 12.1.5 | Restaurar tab bar | Voltar de tela fullscreen | Tab bar reaparece | [ ] |

### 12.2 Navegacao de Pilha (Stack)

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 12.2.1 | Botao voltar | Navegar para tela interna e tocar "Voltar" | Retorna a tela anterior | [E2E] flow 45 |
| 12.2.2 | Gesto de voltar (iOS) | Deslizar da borda esquerda para direita | Tela anterior exibida | [ ] |
| 12.2.3 | Botao voltar Android | Pressionar botao de voltar do sistema | Comportamento correto (volta ou fecha modal) | [ ] |

### 12.3 Estados de Carregamento e Erro

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 12.3.1 | Loading na chamada de API | Abrir tela que busca dados | Indicador de carregamento visivel | [ ] |
| 12.3.2 | Erro de conexao | Desligar internet e tentar carregar dados | Mensagem de erro de conexao amigavel | [ ] MANUAL (rede) |
| 12.3.3 | Timeout de API | Esperar API demorar muito | Mensagem de timeout exibida | [ ] MANUAL (rede) |
| 12.3.4 | Retry apos erro | Tocar em "Tentar novamente" apos erro | Dados recarregados com sucesso | [ ] MANUAL (rede) |

### 12.4 Deep Linking

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 12.4.1 | Abrir via deep link | Abrir URL com scheme do app | App abre na tela correta | [ ] MANUAL (deep link) |
| 12.4.2 | Deep link com app fechado | Clicar em deep link com app nao aberto | App inicia e navega para tela correta | [ ] MANUAL (deep link) |

---

## 13. INTEGRACAO DE SAUDE

### 13.1 HealthKit (iOS)

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 13.1.1 | Solicitar permissao | Primeiro acesso ao tracker | Dialog de permissao do HealthKit aparece | [ ] MANUAL (HealthKit) |
| 13.1.2 | Conceder permissao | Aceitar permissao HealthKit | Dados de saude sincronizam | [ ] MANUAL (HealthKit) |
| 13.1.3 | Negar permissao | Negar permissao HealthKit | App funciona sem dados nativos, sem crash | [ ] MANUAL (HealthKit) |
| 13.1.4 | Sincronizacao de dados | Dados novos no Apple Saude | Dados refletem no app apos sync | [ ] MANUAL (HealthKit) |

### 13.2 Health Connect (Android)

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 13.2.1 | Solicitar permissao | Primeiro acesso ao tracker | Dialog de permissao do Health Connect | [ ] MANUAL (Health Connect) |
| 13.2.2 | Conceder permissao | Aceitar permissao | Dados sincronizam | [ ] MANUAL (Health Connect) |
| 13.2.3 | Negar permissao | Negar permissao | App funciona sem dados, sem crash | [ ] MANUAL (Health Connect) |

---

## 14. SEGURANCA E TOKENS

### 14.1 Gerenciamento de Sessao

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 14.1.1 | Token refresh automatico | Usar app ate token expirar | Refresh transparente, sem deslogar usuario | [ ] MANUAL (tempo) |
| 14.1.2 | Refresh token expirado | Ambos tokens expirados | Usuario redirecionado para login | [ ] MANUAL (tempo) |
| 14.1.3 | Requisicoes em fila | Multiplas requests durante refresh | Todas retomam apos token renovado | [ ] MANUAL (tempo) |
| 14.1.4 | Tokens no SecureStore | Verificar armazenamento | Tokens salvos em SecureStore, nao em AsyncStorage | [ ] MANUAL (debug) |

### 14.2 Verificacao de Versao

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 14.2.1 | App atualizado | Abrir app com versao mais recente | Nenhum bloqueio, app funciona normalmente | [ ] |
| 14.2.2 | Force update | Versao desatualizada que requer atualizacao | Tela de force update bloqueia acesso ate atualizar | [ ] |

---

## 15. CENARIOS ENTRE PLATAFORMAS

### 15.1 iOS vs Android

| # | Cenario | Plataforma | Resultado Esperado | Status |
|---|---------|------------|--------------------|--------|
| 15.1.1 | Layout consistente | iOS e Android | Mesma experiencia visual em ambas plataformas | [ ] |
| 15.1.2 | Fontes customizadas | iOS e Android | Fontes carregam corretamente | [ ] |
| 15.1.3 | Safe area / notch | iOS (notch/dynamic island) | Conteudo nao fica atras do notch | [ ] |
| 15.1.4 | Teclado nao sobrepoe | iOS e Android | Campos de input permanecem visiveis com teclado aberto | [ ] |
| 15.1.5 | Orientacao retrato | iOS e Android | App fixo em retrato (se configurado) | [ ] |
| 15.1.6 | Modo escuro do sistema | iOS e Android | App respeita ou ignora modo escuro do sistema corretamente | [ ] |

---

## 16. CENARIOS DE BORDA (Edge Cases)

| # | Cenario | Passos | Resultado Esperado | Status |
|---|---------|--------|--------------------|--------|
| 16.1 | App em background por longo tempo | Deixar app em background por 30+ min e voltar | App retoma sem crash, dados atualizados | [ ] |
| 16.2 | Memoria baixa | Usar muitos apps simultaneamente | App nao crasha ao ser restaurado | [ ] |
| 16.3 | Rotacao de tela (se permitida) | Rotacionar dispositivo | Layout se adapta ou permanece fixo sem quebra | [ ] |
| 16.4 | Texto grande (acessibilidade) | Ativar texto grande no sistema | App se adapta, textos nao cortados | [ ] |
| 16.5 | Sem internet durante operacao | Perder conexao no meio de uma acao | Erro amigavel, dados nao corrompidos | [ ] |
| 16.6 | Duplo toque rapido em botoes | Tocar rapidamente 2x em "Salvar" | Acao executada apenas uma vez | [ ] |
| 16.7 | Input de caracteres especiais | Inserir emojis, acentos, caracteres especiais em campos | Campos aceitam e exibem corretamente | [ ] |
| 16.8 | Voltar durante carregamento | Pressionar voltar enquanto API responde | Navegacao funciona, sem tela presa | [ ] |

---

## RESUMO

| Area | Total | E2E | Manual | Motivo Manual |
|------|-------|-----|--------|---------------|
| Autenticacao | 24 | 11 | 13 | OAuth, biometria, email, sessao |
| Onboarding | 11 | 7 | 4 | Upload, navegacao back, progresso |
| Homepage | 7 | 5 | 2 | Carrossel, lembrete medicamento |
| Exames | 9 | 5 | 4 | Lista vazia, busca, scroll, recomendacoes |
| Upload | 10 | 3 | 7 | Camera, imagem, manual, estados |
| Carteira de Saude | 7 | 6 | 1 | Carteira vazia |
| Medicamentos | 22 | 10 | 12 | Frequencias, push, dose perdida |
| Tracker / Fitness | 16 | 6 | 10 | HealthKit, metas, registros |
| Saude Mental | 9 | 4 | 5 | Responder 21 perguntas, historico |
| Notificacoes | 9 | 4 | 5 | Push, deep links, delete |
| Configuracoes | 21 | 8 | 13 | Senha, biometria, 2FA, editar perfil |
| Navegacao e UX | 14 | 3 | 11 | Gestos, erros rede, deep links |
| Integracao de Saude | 7 | 0 | 7 | Requer HealthKit/Health Connect |
| Seguranca e Tokens | 6 | 0 | 6 | Requer manipulacao de tempo/tokens |
| Cross-platform | 6 | 0 | 6 | Requer ambas plataformas |
| Edge Cases | 8 | 0 | 8 | Requer condicoes especiais |
| **TOTAL** | **186** | **~72** | **~114** | |

> **50 flows Maestro** (30 existentes + 20 novos) cobrem ~72 cenarios automatizados.
> Os ~114 restantes requerem teste manual por dependerem de: OAuth, sensores biometricos,
> push notifications, HealthKit/Health Connect, manipulacao de rede/tokens, ou condicoes de borda.
