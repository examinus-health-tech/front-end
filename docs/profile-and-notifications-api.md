# API de Foto de Perfil e Preferencias de Notificacao

## Resumo

Implementacao de endpoints para gerenciamento de foto de perfil e preferencias de notificacao do usuario.
Todas as requisicoes requerem autenticacao (token JWT no header).

**Base URL**: `/api/v1/user-personal-data`

---

## 1. Dados do Usuario (GET)

O endpoint GET existente foi modificado para incluir foto de perfil em base64 e preferencias de notificacao.

### Request
```http
GET /api/v1/user-personal-data
Authorization: Bearer {token}
```

### Response
```json
{
  "success": true,
  "data": {
    "fullName": "Nome do Usuario",
    "email": "usuario@email.com",
    "cpf": "12345678900",
    "birthDate": "1990-01-15T00:00:00Z",
    "gender": "Masculino",
    "phone": "(11) 99999-9999",
    "profilePhotoBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
    "notificationPreferences": {
      "dailyReminders": true,
      "healthInsights": true,
      "examInfo": true,
      "chatbotNotifications": false
    }
  }
}
```

**Campos novos:**
- `profilePhotoBase64`: Foto do perfil em formato data URL (null se nao houver foto)
- `notificationPreferences`: Objeto com preferencias de notificacao

---

## 2. Foto de Perfil

### 2.1 Upload de Foto

**Endpoint**: `PUT /api/v1/user-personal-data/profile-photo`

Faz upload da foto de perfil. Aceita base64 com ou sem prefixo data URL.

#### Request
```http
PUT /api/v1/user-personal-data/profile-photo
Authorization: Bearer {token}
Content-Type: application/json

{
  "photoBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
}
```

**Ou sem prefixo:**
```json
{
  "photoBase64": "/9j/4AAQSkZJRgABAQ..."
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "photoBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
  }
}
```

#### Validacoes
- Tamanho maximo: **5MB**
- Formatos aceitos: JPEG, PNG
- Resolucao recomendada: 400x400px

#### Erros
- `400 Bad Request`: "Foto e obrigatoria." - campo vazio
- `400 Bad Request`: "Formato de imagem base64 invalido." - base64 mal formado
- `400 Bad Request`: "A foto deve ter no maximo 5MB." - arquivo muito grande

### 2.2 Remover Foto

**Endpoint**: `DELETE /api/v1/user-personal-data/profile-photo`

Remove a foto de perfil do usuario.

#### Request
```http
DELETE /api/v1/user-personal-data/profile-photo
Authorization: Bearer {token}
```

#### Response (204 No Content)
Sem corpo de resposta.

#### Erros
- `400 Bad Request`: "Usuario nao possui foto de perfil." - quando nao ha foto

---

## 3. Preferencias de Notificacao

### 3.1 Consultar Preferencias

**Endpoint**: `GET /api/v1/user-personal-data/notification-preferences`

Retorna as preferencias de notificacao do usuario.

#### Request
```http
GET /api/v1/user-personal-data/notification-preferences
Authorization: Bearer {token}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "dailyReminders": true,
    "healthInsights": true,
    "examInfo": true,
    "chatbotNotifications": false
  }
}
```

### 3.2 Atualizar Preferencias

**Endpoint**: `PUT /api/v1/user-personal-data/notification-preferences`

Atualiza as preferencias de notificacao do usuario.

#### Request
```http
PUT /api/v1/user-personal-data/notification-preferences
Authorization: Bearer {token}
Content-Type: application/json

{
  "dailyReminders": true,
  "healthInsights": true,
  "examInfo": false,
  "chatbotNotifications": true
}
```

#### Response (204 No Content)
Sem corpo de resposta.

---

## 4. Preferencias de Notificacao - Detalhes

| Preferencia | Default | Descricao | Tipos de Notificacao Afetados |
|-------------|---------|-----------|-------------------------------|
| `dailyReminders` | `true` | Lembretes diarios e de engajamento | Meta de passos, Hook Forte, Engajamento Leve, Retencao |
| `healthInsights` | `true` | Insights e dicas de saude | Insight Mensal, Bem-estar, Saude/Checkup |
| `examInfo` | `true` | Informacoes sobre exames | Exame Enviado, Exame Processado |
| `chatbotNotifications` | `false` | Mensagens do medico/chatbot | Mensagem do Medico |

**Nota**: Notificacoes de "Nova Funcionalidade" sempre sao enviadas, independente das preferencias.

---

## 5. Exemplos de Integracao (React Native/TypeScript)

### 5.1 Buscar Dados do Usuario com Foto

```typescript
interface UserPersonalData {
  fullName: string;
  email: string;
  cpf?: string;
  birthDate?: string;
  gender?: string;
  phone?: string;
  profilePhotoBase64?: string;
  notificationPreferences?: NotificationPreferences;
}

interface NotificationPreferences {
  dailyReminders: boolean;
  healthInsights: boolean;
  examInfo: boolean;
  chatbotNotifications: boolean;
}

async function getUserData(): Promise<UserPersonalData> {
  const response = await api.get('/user-personal-data');
  return response.data.data;
}
```

### 5.2 Upload de Foto de Perfil

```typescript
import * as ImagePicker from 'expo-image-picker';

async function uploadProfilePhoto() {
  // Selecionar imagem
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
    base64: true,
  });

  if (!result.canceled && result.assets[0].base64) {
    const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;

    const response = await api.put('/user-personal-data/profile-photo', {
      photoBase64: base64,
    });

    // Retorna a foto salva em base64
    return response.data.data.photoBase64;
  }
}
```

### 5.3 Exibir Foto de Perfil

```tsx
import { Image } from 'react-native';

function ProfilePhoto({ photoBase64 }: { photoBase64?: string }) {
  if (!photoBase64) {
    return <DefaultAvatar />;
  }

  return (
    <Image
      source={{ uri: photoBase64 }}
      style={{ width: 100, height: 100, borderRadius: 50 }}
    />
  );
}
```

### 5.4 Remover Foto de Perfil

```typescript
async function deleteProfilePhoto() {
  await api.delete('/user-personal-data/profile-photo');
}
```

### 5.5 Gerenciar Preferencias de Notificacao

```typescript
// Buscar preferencias
async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const response = await api.get('/user-personal-data/notification-preferences');
  return response.data.data;
}

// Atualizar preferencias
async function updateNotificationPreferences(
  preferences: NotificationPreferences
): Promise<void> {
  await api.put('/user-personal-data/notification-preferences', preferences);
}

// Exemplo de tela de configuracoes
function NotificationSettingsScreen() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    dailyReminders: true,
    healthInsights: true,
    examInfo: true,
    chatbotNotifications: false,
  });

  const handleToggle = async (key: keyof NotificationPreferences) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    await updateNotificationPreferences(updated);
  };

  return (
    <View>
      <SwitchRow
        label="Lembretes Diarios"
        description="Receba lembretes para avaliacoes de saude"
        value={preferences.dailyReminders}
        onValueChange={() => handleToggle('dailyReminders')}
      />
      <SwitchRow
        label="Insights de Saude"
        description="Receba insights e dicas de saude"
        value={preferences.healthInsights}
        onValueChange={() => handleToggle('healthInsights')}
      />
      <SwitchRow
        label="Informacoes de Exames"
        description="Receba atualizacoes sobre seus exames"
        value={preferences.examInfo}
        onValueChange={() => handleToggle('examInfo')}
      />
      <SwitchRow
        label="Notificacoes do Chatbot"
        description="Receba mensagens do medico"
        value={preferences.chatbotNotifications}
        onValueChange={() => handleToggle('chatbotNotifications')}
      />
    </View>
  );
}
```

---

## 6. Consideracoes Importantes

1. **Foto em Base64**: A foto e sempre transmitida em formato base64 (data URL). Isso simplifica a integracao mas aumenta o tamanho do payload.

2. **Armazenamento**: As fotos sao armazenadas no AWS S3. O backend converte para/de base64 automaticamente.

3. **Preferencias Padrao**: Se o usuario nunca configurou preferencias, os valores padrao serao retornados (todos true exceto chatbot).

4. **Validacao de Preferencias**: O backend valida as preferencias antes de enviar qualquer notificacao push. Se desabilitado, a notificacao nao e enviada.

5. **Cache**: Considere implementar cache local para a foto de perfil para evitar recarregamentos desnecessarios.

---

## 7. Migracao de Banco de Dados

A migracao `AddProfilePhotoAndNotificationPreferences` adiciona os seguintes campos a tabela `UserPersonalData`:

- `ProfilePhotoUrl` (nvarchar, nullable) - URL da foto no S3
- `NotifyDailyReminders` (bit, default: true)
- `NotifyHealthInsights` (bit, default: true)
- `NotifyExamInfo` (bit, default: true)
- `NotifyChatbot` (bit, default: false)

Execute a migracao antes de usar os novos endpoints:
```bash
dotnet ef database update
```
