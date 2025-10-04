"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

interface HealthConditionSelectorProps {
  hasCondition: boolean
  conditionCategory: string
  onConditionChange: (hasCondition: boolean) => void
  onCategoryChange: (category: string) => void
}

const healthConditions = [
  { value: "asthma", label: "Asma" },
  { value: "copd", label: "DPOC (Doença Pulmonar Obstrutiva Crônica)" },
  { value: "bronchitis", label: "Bronquite Crônica" },
  { value: "allergies", label: "Alergias Respiratórias" },
  { value: "heart", label: "Problemas Cardíacos" },
  { value: "other", label: "Outra Condição" },
]

export function HealthConditionSelector({
  hasCondition,
  conditionCategory,
  onConditionChange,
  onCategoryChange,
}: HealthConditionSelectorProps) {
  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="health-condition">Condição de Saúde (Opcional)</Label>
          <p className="text-sm text-muted-foreground">Possui alguma condição respiratória ou cardíaca?</p>
        </div>
        <Switch id="health-condition" checked={hasCondition} onCheckedChange={onConditionChange} />
      </div>

      {hasCondition && (
        <>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Receberá alertas personalizados quando a qualidade do ar puder afetar sua condição
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            <Label htmlFor="condition-category">Categoria da Condição</Label>
            <Select value={conditionCategory} onValueChange={onCategoryChange}>
              <SelectTrigger id="condition-category">
                <SelectValue placeholder="Selecione sua condição" />
              </SelectTrigger>
              <SelectContent>
                {healthConditions.map((condition) => (
                  <SelectItem key={condition.value} value={condition.value}>
                    {condition.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  )
}
