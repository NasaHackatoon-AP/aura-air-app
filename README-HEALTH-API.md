# 🏥 API de Perfil de Saúde - Air Aura App

## 📋 Visão Geral

Sistema de gerenciamento de perfis de saúde integrado ao Air Aura App, permitindo que usuários registrem suas condições médicas para receber alertas personalizados sobre qualidade do ar.

## 🚀 Funcionalidades

- ✅ **Criar Perfil** - Registra condições de saúde do usuário
- ✅ **Visualizar Perfil** - Exibe informações de saúde atuais
- ✅ **Atualizar Perfil** - Modifica dados de saúde existentes
- ✅ **Deletar Perfil** - Remove perfil de saúde
- ✅ **Interface Responsiva** - Funciona em mobile e desktop
- ✅ **Validação de Dados** - Campos obrigatórios e tipos corretos

## 🏗️ Arquitetura

```
Frontend (React) → Next.js API Route → API Externa
     ↓                    ↓              ↓
Componentes UI → /api/health-profile → Railway API
```

## 🔗 Endpoints

| Método   | Endpoint                          | Descrição         |
| -------- | --------------------------------- | ----------------- |
| `POST`   | `/api/health-profile`             | Criar novo perfil |
| `GET`    | `/api/health-profile?userId={id}` | Buscar perfil     |
| `PUT`    | `/api/health-profile?userId={id}` | Atualizar perfil  |
| `DELETE` | `/api/health-profile?userId={id}` | Deletar perfil    |

## 📊 Estrutura de Dados

```typescript
interface HealthProfile {
  id: number; // ID único do perfil
  usuario_id: number; // ID do usuário
  possui_asma: boolean; // Possui asma
  possui_dpoc: boolean; // Possui DPOC
  possui_alergias: boolean; // Possui alergias
  fumante: boolean; // É fumante
  sensibilidade_alta: boolean; // Alta sensibilidade
  data_criacao: string; // Data de criação
  ultima_atualizacao: string; // Última atualização
}
```

## 🎨 Componentes

### HealthProfile

Componente principal para gerenciar perfil de saúde.

```tsx
import { HealthProfile } from "@/components/Health/HealthProfile/HealthProfile";

<HealthProfile />;
```

### Hook useHealthProfile

Hook personalizado para gerenciar estado e operações.

```tsx
import { useHealthProfile } from "@/hooks/useHealthProfile";

const { profile, createProfile, updateProfile, isLoading, error } =
  useHealthProfile({ userId: 1 });
```

## 🧪 Teste

Acesse `/test-health-profile` para testar todas as funcionalidades:

- **Criar Perfil** - Testa criação de novo perfil
- **Buscar Perfil** - Testa busca de perfil existente
- **Atualizar Perfil** - Testa atualização de dados
- **Deletar Perfil** - Testa remoção de perfil

## 📝 Exemplo de Uso

```typescript
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
  fumante: true,
});

// Deletar perfil
await healthProfileService.deleteProfile(1);
```

## ⚠️ Status Atual

| Operação   | Status       | Observação                            |
| ---------- | ------------ | ------------------------------------- |
| **POST**   | ✅ Funcional | Usa API externa real                  |
| **GET**    | ⚠️ Simulado  | Retorna null (perfil não encontrado)  |
| **PUT**    | ⚠️ Simulado  | Simula atualização com dados mockados |
| **DELETE** | ⚠️ Simulado  | Simula deleção com resposta mockada   |

## 🔧 Configuração

### Arquivos Principais

- `app/api/health-profile/route.ts` - API Route (proxy)
- `services/healthProfileService.ts` - Serviço de integração
- `hooks/useHealthProfile.ts` - Hook personalizado
- `components/Health/HealthProfile/` - Componentes UI

### Variáveis de Ambiente

```env
NEXT_PUBLIC_API_BASE_URL=https://gustavo-production-08e9.up.railway.app
```

## 🚀 Como Usar

### 1. No Dashboard

```tsx
import { HealthProfile } from "@/components/Health/HealthProfile/HealthProfile";

// Adicionar ao dashboard
<HealthProfile />;
```

### 2. Em Qualquer Componente

```tsx
import { useHealthProfile } from "@/hooks/useHealthProfile";

function MyComponent() {
  const { profile, createProfile, isLoading, error } = useHealthProfile({
    userId: 1,
  });

  // Usar profile, createProfile, etc.
}
```

### 3. Serviço Direto

```tsx
import healthProfileService from "@/services/healthProfileService";

// Criar perfil
const profile = await healthProfileService.createProfile(data);
```

## 📞 Suporte

- **Documentação Completa**: `/docs/health-profile-api.md`
- **Página de Teste**: `/test-health-profile`
- **Logs**: Console do navegador e terminal
- **Debug**: Componente `HealthProfileDebug`

## 🎯 Próximos Passos

1. Implementar cache local para perfis
2. Sincronizar com API externa quando disponível
3. Adicionar validação robusta
4. Implementar logs de auditoria
5. Adicionar testes automatizados

---

**Desenvolvido para o Air Aura App - NASA Space Apps Challenge 2024** 🚀
