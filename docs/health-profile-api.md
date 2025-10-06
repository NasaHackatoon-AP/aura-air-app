# API de Perfil de Saúde - Documentação

## 📋 Visão Geral

A API de Perfil de Saúde permite gerenciar informações de saúde dos usuários, incluindo condições médicas como asma, DPOC, alergias, tabagismo e sensibilidade alta. Esta integração segue o mesmo padrão da API do chatbot, utilizando um proxy Next.js para evitar problemas de CORS.

## 🏗️ Arquitetura

```
Frontend (React) → Next.js API Route → API Externa
     ↓                    ↓              ↓
Componentes UI → /api/health-profile → gustavo-production-08e9.up.railway.app
```

## 🔗 Endpoints Disponíveis

### Base URL

```
Local: http://localhost:3000/api/health-profile
Produção: https://seu-dominio.com/api/health-profile
```

### 1. **POST** - Criar Perfil de Saúde

```http
POST /api/health-profile
Content-Type: application/json

{
  "usuario_id": 1,
  "possui_asma": true,
  "possui_dpoc": false,
  "possui_alergias": true,
  "fumante": false,
  "sensibilidade_alta": true
}
```

**Resposta (200):**

```json
{
  "id": 123,
  "usuario_id": 1,
  "possui_asma": true,
  "possui_dpoc": false,
  "possui_alergias": true,
  "fumante": false,
  "sensibilidade_alta": true,
  "data_criacao": "2024-01-15T10:30:00Z",
  "ultima_atualizacao": "2024-01-15T10:30:00Z"
}
```

### 2. **GET** - Buscar Perfil de Saúde

```http
GET /api/health-profile?userId=1
```

**Resposta (200):**

```json
{
  "id": 123,
  "usuario_id": 1,
  "possui_asma": true,
  "possui_dpoc": false,
  "possui_alergias": true,
  "fumante": false,
  "sensibilidade_alta": true,
  "data_criacao": "2024-01-15T10:30:00Z",
  "ultima_atualizacao": "2024-01-15T10:30:00Z"
}
```

**Resposta (404):**

```json
null
```

### 3. **PUT** - Atualizar Perfil de Saúde

```http
PUT /api/health-profile?userId=1
Content-Type: application/json

{
  "usuario_id": 1,
  "possui_asma": false,
  "possui_dpoc": true,
  "possui_alergias": false,
  "fumante": true,
  "sensibilidade_alta": false
}
```

**Resposta (200):**

```json
{
  "id": 123,
  "usuario_id": 1,
  "possui_asma": false,
  "possui_dpoc": true,
  "possui_alergias": false,
  "fumante": true,
  "sensibilidade_alta": false,
  "data_criacao": "2024-01-15T10:30:00Z",
  "ultima_atualizacao": "2024-01-15T11:45:00Z"
}
```

### 4. **DELETE** - Deletar Perfil de Saúde

```http
DELETE /api/health-profile?userId=1
```

**Resposta (200):**

```json
{
  "message": "Profile deleted successfully",
  "userId": 1
}
```

## 📊 Estrutura de Dados

### HealthProfileRequest

```typescript
interface HealthProfileRequest {
  usuario_id: number; // ID do usuário (obrigatório)
  possui_asma: boolean; // Possui asma
  possui_dpoc: boolean; // Possui DPOC (Doença Pulmonar Obstrutiva Crônica)
  possui_alergias: boolean; // Possui alergias
  fumante: boolean; // É fumante
  sensibilidade_alta: boolean; // Alta sensibilidade a poluentes
}
```

### HealthProfileResponse

```typescript
interface HealthProfileResponse {
  id: number; // ID único do perfil
  usuario_id: number; // ID do usuário
  possui_asma: boolean; // Possui asma
  possui_dpoc: boolean; // Possui DPOC
  possui_alergias: boolean; // Possui alergias
  fumante: boolean; // É fumante
  sensibilidade_alta: boolean; // Alta sensibilidade
  data_criacao: string; // Data de criação (ISO 8601)
  ultima_atualizacao: string; // Data da última atualização (ISO 8601)
}
```

## 🛠️ Como Usar no Frontend

### 1. Hook Personalizado

```typescript
import { useHealthProfile } from "@/hooks/useHealthProfile";

function MyComponent() {
  const {
    profile,
    isLoading,
    error,
    createProfile,
    updateProfile,
    deleteProfile,
    fetchProfile,
    hasProfile,
  } = useHealthProfile({ userId: 1 });

  // Usar os métodos e estados...
}
```

### 2. Serviço Direto

```typescript
import healthProfileService from "@/services/healthProfileService";

// Criar perfil
const newProfile = await healthProfileService.createProfile({
  usuario_id: 1,
  possui_asma: true,
  possui_dpoc: false,
  possui_alergias: true,
  fumante: false,
  sensibilidade_alta: true,
});

// Buscar perfil
const profile = await healthProfileService.getProfile(1);

// Atualizar perfil
const updatedProfile = await healthProfileService.updateProfile(1, {
  usuario_id: 1,
  possui_asma: false,
  // ... outros campos
});

// Deletar perfil
await healthProfileService.deleteProfile(1);
```

## 🎨 Componentes Disponíveis

### 1. HealthProfile

Componente principal para exibir e gerenciar o perfil de saúde.

```tsx
import { HealthProfile } from "@/components/Health/HealthProfile/HealthProfile";

<HealthProfile />;
```

### 2. HealthProfileTest

Componente para testar todas as operações da API.

```tsx
import { HealthProfileTest } from "@/components/Health/HealthProfileTest/HealthProfileTest";

<HealthProfileTest />;
```

### 3. HealthProfileDebug

Componente de debug com interface para testar operações.

```tsx
import { HealthProfileDebug } from "@/components/Health/HealthProfileDebug/HealthProfileDebug";

<HealthProfileDebug />;
```

## 🧪 Página de Teste

Acesse `/test-health-profile` para testar todas as funcionalidades:

- **Criar Perfil** - Testa criação de novo perfil
- **Buscar Perfil** - Testa busca de perfil existente
- **Atualizar Perfil** - Testa atualização de dados
- **Deletar Perfil** - Testa remoção de perfil

## ⚠️ Limitações Atuais

### API Externa

- ✅ **POST** - Funciona com API externa real
- ⚠️ **GET** - Retorna null (simulado)
- ⚠️ **PUT** - Simula atualização (mockado)
- ⚠️ **DELETE** - Simula deleção (mockado)

### Motivo das Limitações

A API externa (`gustavo-production-08e9.up.railway.app/airquality/perfil`) não suporta:

- Busca por `usuario_id`
- Operações PUT/DELETE por ID
- Query parameters para GET

## 🔧 Configuração

### Variáveis de Ambiente

```env
NEXT_PUBLIC_API_BASE_URL=https://gustavo-production-08e9.up.railway.app
```

### Arquivos de Configuração

- `app/api/health-profile/route.ts` - API Route (proxy)
- `services/healthProfileService.ts` - Serviço de integração
- `hooks/useHealthProfile.ts` - Hook personalizado
- `types/healthProfile.ts` - Tipos TypeScript

## 🚀 Exemplos de Uso

### Exemplo 1: Criar Perfil

```typescript
const profileData = {
  usuario_id: 1,
  possui_asma: true,
  possui_dpoc: false,
  possui_alergias: true,
  fumante: false,
  sensibilidade_alta: true,
};

const newProfile = await healthProfileService.createProfile(profileData);
console.log("Perfil criado:", newProfile);
```

### Exemplo 2: Usar Hook

```typescript
function HealthDashboard() {
  const { profile, createProfile, isLoading, error } = useHealthProfile({
    userId: 1,
  });

  const handleCreateProfile = async () => {
    try {
      await createProfile({
        usuario_id: 1,
        possui_asma: true,
        possui_dpoc: false,
        possui_alergias: true,
        fumante: false,
        sensibilidade_alta: true,
      });
    } catch (err) {
      console.error("Erro ao criar perfil:", err);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {profile ? (
        <div>Perfil: {JSON.stringify(profile)}</div>
      ) : (
        <button onClick={handleCreateProfile}>Criar Perfil</button>
      )}
    </div>
  );
}
```

## 📝 Logs e Debug

### Console Logs

A API route registra logs para debug:

```
GET request for userId: 1 - API não suporta busca por usuario_id
PUT request for userId: 1 - Simulando atualização
DELETE request for userId: 1 - Simulando deleção
```

### Teste Manual

```bash
# Testar POST
curl -X POST http://localhost:3000/api/health-profile \
  -H "Content-Type: application/json" \
  -d '{"usuario_id":1,"possui_asma":true,"possui_dpoc":false,"possui_alergias":true,"fumante":false,"sensibilidade_alta":true}'

# Testar GET
curl -X GET "http://localhost:3000/api/health-profile?userId=1"

# Testar PUT
curl -X PUT "http://localhost:3000/api/health-profile?userId=1" \
  -H "Content-Type: application/json" \
  -d '{"usuario_id":1,"possui_asma":false,"possui_dpoc":true,"possui_alergias":false,"fumante":true,"sensibilidade_alta":false}'

# Testar DELETE
curl -X DELETE "http://localhost:3000/api/health-profile?userId=1"
```

## 🎯 Próximos Passos

1. **Implementar cache local** para perfis criados
2. **Sincronizar com API externa** quando endpoints estiverem disponíveis
3. **Adicionar validação** de dados mais robusta
4. **Implementar paginação** para múltiplos perfis
5. **Adicionar logs** de auditoria

## 📞 Suporte

Para dúvidas ou problemas:

- Verifique os logs do console
- Teste na página `/test-health-profile`
- Consulte a documentação da API externa
- Verifique a configuração de CORS
