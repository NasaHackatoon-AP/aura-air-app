import {
  HealthProfileRequest,
  HealthProfileResponse,
} from "@/types/healthProfile";

const healthProfileService = {
  // Criar perfil de saúde
  createProfile: async (profileData: HealthProfileRequest) => {
    const res = await fetch("/api/health-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`health profile proxy error: ${res.status} ${text}`);
    }

    return res.json();
  },

  // Buscar perfil de saúde por ID do usuário
  getProfile: async (userId: number) => {
    const res = await fetch(`/api/health-profile?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null; // Perfil não encontrado
      }
      const text = await res.text();
      throw new Error(`health profile proxy error: ${res.status} ${text}`);
    }

    return res.json();
  },

  // Atualizar perfil de saúde
  updateProfile: async (userId: number, profileData: HealthProfileRequest) => {
    const res = await fetch(`/api/health-profile?userId=${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`health profile proxy error: ${res.status} ${text}`);
    }

    return res.json();
  },

  // Deletar perfil de saúde
  deleteProfile: async (userId: number) => {
    const res = await fetch(`/api/health-profile?userId=${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`health profile proxy error: ${res.status} ${text}`);
    }

    return res.json();
  },
};

export default healthProfileService;
export type { HealthProfileRequest, HealthProfileResponse };
