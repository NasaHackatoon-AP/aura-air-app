"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { HealthProfileRequest } from "@/types/healthProfile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle, XCircle, Loader2 } from "lucide-react";

const MOCK_USER_ID = 1;

export function HealthProfileDebug() {
  const {
    profile,
    isLoading,
    error,
    createProfile,
    updateProfile,
    deleteProfile,
    fetchProfile,
    hasProfile,
  } = useHealthProfile({ userId: MOCK_USER_ID, autoFetch: false }); // Desabilita autoFetch para controle manual

  const [testResults, setTestResults] = useState<{
    create?: { success: boolean; message: string };
    fetch?: { success: boolean; message: string };
    update?: { success: boolean; message: string };
    delete?: { success: boolean; message: string };
  }>({});
  const [isTesting, setIsTesting] = useState(false);

  const defaultFormData: HealthProfileRequest = {
    usuario_id: MOCK_USER_ID,
    possui_asma: true,
    possui_dpoc: false,
    possui_alergias: true,
    fumante: false,
    sensibilidade_alta: true,
  };

  const updatedFormData: HealthProfileRequest = {
    usuario_id: MOCK_USER_ID,
    possui_asma: false,
    possui_dpoc: true,
    possui_alergias: false,
    fumante: true,
    sensibilidade_alta: false,
  };

  const runTest = async (
    action: "create" | "fetch" | "update" | "delete",
    testFn: () => Promise<any>
  ) => {
    setIsTesting(true);
    setTestResults((prev) => ({ ...prev, [action]: undefined }));
    try {
      await testFn();
      setTestResults((prev) => ({
        ...prev,
        [action]: { success: true, message: `${action} bem-sucedido!` },
      }));
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [action]: {
          success: false,
          message: `Erro no ${action}: ${err.message || "Erro desconhecido"}`,
        },
      }));
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Debug da API de Perfil de Saúde
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() =>
              runTest("create", () => createProfile(defaultFormData))
            }
            disabled={isTesting || hasProfile}
          >
            {isTesting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Testar Criar
          </Button>
          <Button
            onClick={() => runTest("fetch", fetchProfile)}
            disabled={isTesting}
          >
            {isTesting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Testar Buscar
          </Button>
          <Button
            onClick={() =>
              runTest("update", () => updateProfile(updatedFormData))
            }
            disabled={isTesting || !hasProfile}
          >
            {isTesting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Testar Atualizar
          </Button>
          <Button
            onClick={() => runTest("delete", deleteProfile)}
            disabled={isTesting || !hasProfile}
          >
            {isTesting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Testar Deletar
          </Button>
        </div>

        <div className="space-y-2">
          {testResults.create && (
            <Alert
              variant={testResults.create.success ? "default" : "destructive"}
            >
              {testResults.create.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {testResults.create.success ? "Sucesso" : "Erro"}
              </AlertTitle>
              <AlertDescription>{testResults.create.message}</AlertDescription>
            </Alert>
          )}
          {testResults.fetch && (
            <Alert
              variant={testResults.fetch.success ? "default" : "destructive"}
            >
              {testResults.fetch.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {testResults.fetch.success ? "Sucesso" : "Erro"}
              </AlertTitle>
              <AlertDescription>{testResults.fetch.message}</AlertDescription>
            </Alert>
          )}
          {testResults.update && (
            <Alert
              variant={testResults.update.success ? "default" : "destructive"}
            >
              {testResults.update.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {testResults.update.success ? "Sucesso" : "Erro"}
              </AlertTitle>
              <AlertDescription>{testResults.update.message}</AlertDescription>
            </Alert>
          )}
          {testResults.delete && (
            <Alert
              variant={testResults.delete.success ? "default" : "destructive"}
            >
              {testResults.delete.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {testResults.delete.success ? "Sucesso" : "Erro"}
              </AlertTitle>
              <AlertDescription>{testResults.delete.message}</AlertDescription>
            </Alert>
          )}
        </div>

        {profile && (
          <div className="mt-4 p-4 border rounded-md bg-muted">
            <h3 className="font-semibold mb-2">
              Perfil Atual (ID: {profile.usuario_id})
            </h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro Geral</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
