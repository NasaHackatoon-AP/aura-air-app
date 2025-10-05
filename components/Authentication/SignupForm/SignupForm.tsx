"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createUser } from "@/services/serviceUser"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useBrazilLocation } from "@/hooks/useBrazilLocation"
// HealthConditionSelector removed per request; added dateOfBirth, city, state fields instead

export function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
    city: "",
    state: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedState, setSelectedState] = useState("")
  
  const { states, cities, loadingStates, loadCitiesByState } = useBrazilLocation()

  const handleStateChange = (stateCode: string) => {
    setSelectedState(stateCode)
    setFormData({ ...formData, state: stateCode, city: "" }) // Reset city when state changes
    loadCitiesByState(stateCode)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // basic client-side validation
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.dateOfBirth ||
        !formData.city ||
        !formData.state
      ) {
        setError("Por favor, preencha todos os campos obrigatórios")
        setIsLoading(false)
        return
      }

      const payload = {
        nome: formData.name,
        email: formData.email,
        senha: formData.password,
        data_nascimento: formData.dateOfBirth,
        cidade: formData.city,
        estado: formData.state,
      }

      // debug: log payload and endpoint
      try {
        // @ts-ignore - for debug only
        console.debug("createUser payload:", payload)
      } catch (e) {}

      const res = await createUser(payload)
      // Only create the user — show modal on success (2xx)
      if (res?.status >= 200 && res.status < 300) {
        setIsDialogOpen(true)
      } else {
        setSuccess("Usuário criado com sucesso")
      }
      setIsLoading(false)
    } catch (err: any) {
      // Try to show server-provided message or a generic one
      const status = err?.response?.status
      const respData = err?.response?.data
      console.error("createUser error status:", status, "data:", respData)
      const message = respData?.message || respData || err?.message || "Erro ao cadastrar usuário"
      setError(String(message))
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>Preencha os dados abaixo para criar sua conta</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {isDialogOpen && (
            <AlertDialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) router.push('/login')
            }}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Usuário criado</AlertDialogTitle>
                  <AlertDialogDescription>
                    Usuário criado com sucesso. Você será redirecionado para a tela de login ao fechar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Fechar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => router.push('/login')}>Ir para Login</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="João Silva"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Nome de Usuário</Label>
            <Input
              id="username"
              type="text"
              placeholder="joaosilva"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="state">Estado</Label>
              <Select value={selectedState} onValueChange={handleStateChange} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingStates ? "Carregando estados..." : "Selecione o estado"} />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.sigla} value={state.sigla}>
                      {state.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="city">Cidade</Label>
              <Select 
                value={formData.city} 
                onValueChange={(city) => setFormData({ ...formData, city })}
                disabled={!selectedState || loadingStates}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={
                    loadingStates ? "Carregando..." :
                    !selectedState ? "Primeiro selecione um estado" :
                    "Selecione a cidade"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.nome}>
                      {city.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <br />
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar Conta"
            )}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
