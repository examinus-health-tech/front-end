# Especificação Backend - Configurações de Notificações

## 1. Atualizar Preferências de Notificação

### Endpoint
```
PUT /user/notification-preferences
```

### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Request Body
```json
{
  "dailyReminders": true,
  "healthInsights": true,
  "examInfo": false,
  "chatbotNotifications": false
}
```

### Descrição dos Campos
- `dailyReminders`: Lembretes diários para concluir avaliações de saúde
- `healthInsights`: Insights e dicas sobre saúde
- `examInfo`: Informações sobre status de exames (processamento, conclusão, erros)
- `chatbotNotifications`: Notificações do chatbot de saúde

### Response Success (200)
```json
{
  "success": true,
  "message": "Preferências de notificação atualizadas com sucesso",
  "data": {
    "dailyReminders": true,
    "healthInsights": true,
    "examInfo": false,
    "chatbotNotifications": false,
    "updatedAt": "2025-12-11T10:30:00Z"
  }
}
```

---

## 2. Obter Preferências de Notificação

### Endpoint
```
GET /user/notification-preferences
```

### Headers
```
Authorization: Bearer {token}
```

### Response Success (200)
```json
{
  "success": true,
  "data": {
    "dailyReminders": true,
    "healthInsights": true,
    "examInfo": false,
    "chatbotNotifications": false
  }
}
```

### Comportamento Padrão
Se o usuário ainda não configurou preferências, retornar valores padrão:
```json
{
  "dailyReminders": true,
  "healthInsights": true,
  "examInfo": true,
  "chatbotNotifications": false
}
```

---

## 3. Integração com OneSignal

### Tags do OneSignal
Quando as preferências forem atualizadas, também atualizar as tags no OneSignal para segmentação:

```javascript
{
  "daily_reminders": "true",
  "health_insights": "true",
  "exam_info": "false",
  "chatbot_notifications": "false"
}
```

### Envio de Notificações
Usar essas tags para segmentar o envio:
- **Lembretes Diários**: Enviar apenas para usuários com `daily_reminders: "true"`
- **Health Insights**: Enviar apenas para usuários com `health_insights: "true"`
- **Informações de Exames**: Enviar apenas para usuários com `exam_info: "true"`
- **Chatbot**: Enviar apenas para usuários com `chatbot_notifications: "true"`

---

## 4. Recomendações

1. **Validação**: Todos os campos devem ser booleanos
2. **Persistência**: Salvar no banco de dados associado ao userId
3. **Sincronização**: Atualizar tags do OneSignal em tempo real quando preferências mudarem
4. **Default**: Se GET retornar erro 404, frontend deve usar valores padrão e fazer PUT na primeira mudança
5. **Rate Limiting**: Limitar a 10 atualizações por minuto por usuário
