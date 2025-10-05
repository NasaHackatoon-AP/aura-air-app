import { HealthProfile } from "@/components/Health/HealthProfile/HealthProfile";
import { HealthProfileTest } from "@/components/Health/HealthProfileTest/HealthProfileTest";
import { HealthProfileDebug } from "@/components/Health/HealthProfileDebug/HealthProfileDebug";

export default function TestHealthProfilePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Teste da API de Perfil de Saúde</h1>
        <p className="text-muted-foreground mt-2">
          Use esta página para testar todas as funcionalidades da API de perfil
          de saúde.
        </p>
      </div>

      <div className="space-y-6">
        <HealthProfileDebug />
        <HealthProfileTest />
        <HealthProfile />
      </div>
    </div>
  );
}
