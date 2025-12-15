# Especificação Backend - Foto de Perfil

## 1. Upload de Foto de Perfil

### Endpoint
```
PUT /user/profile-photo
```

### Headers
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

### Request Body
```
{
  "photo": File (imagem)
}
```

### Validações
- Formatos aceitos: JPG, JPEG, PNG
- Tamanho máximo: 5MB
- Dimensões recomendadas: 400x400px (será redimensionada se necessário)

### Response Success (200)
```json
{
  "success": true,
  "message": "Foto de perfil atualizada com sucesso",
  "data": {
    "photoUrl": "https://storage.example.com/users/123/profile.jpg",
    "updatedAt": "2025-12-11T10:30:00Z"
  }
}
```

### Response Error (400)
```json
{
  "success": false,
  "error": "Formato de arquivo não suportado"
}
```

---

## 2. Remover Foto de Perfil

### Endpoint
```
DELETE /user/profile-photo
```

### Headers
```
Authorization: Bearer {token}
```

### Response Success (200)
```json
{
  "success": true,
  "message": "Foto de perfil removida com sucesso"
}
```

---

## 3. Obter Dados do Usuário (Atualizado)

### Endpoint Existente
```
GET /user
```

### Response - Adicionar campo photoUrl
```json
{
  "userId": "123",
  "name": "João Silva",
  "email": "joao@example.com",
  "fullName": "João Silva Santos",
  "photoUrl": "https://storage.example.com/users/123/profile.jpg", // NOVO CAMPO
  // ... outros campos existentes
}
```

**Nota:** Se o usuário não tiver foto, `photoUrl` deve ser `null` ou não incluído.

---

## 4. Recomendações de Implementação

### Storage
- Usar serviço de armazenamento (AWS S3, Google Cloud Storage, ou similar)
- Organizar por userId: `/users/{userId}/profile.jpg`
- Gerar URLs assinadas com expiração se necessário

### Processamento
- Redimensionar imagem para 400x400px (quadrado)
- Otimizar qualidade (80-90% JPEG)
- Gerar thumbnail 100x100px para listagens (opcional)

### Segurança
- Validar tipo de arquivo (não confiar apenas na extensão)
- Escanear para malware
- Limitar taxa de upload (rate limiting)

### Performance
- CDN para servir imagens
- Cache de 1 ano nas imagens
- Lazy loading no frontend

---

## 5. Fluxo de Atualização

1. Frontend seleciona imagem
2. Frontend comprime imagem (opcional, para economizar banda)
3. Frontend envia via multipart/form-data para `/user/profile-photo`
4. Backend valida, processa e armazena
5. Backend retorna URL da imagem
6. Frontend atualiza estado local e exibe nova foto
7. Próximas chamadas ao `/user` retornarão o novo `photoUrl`
