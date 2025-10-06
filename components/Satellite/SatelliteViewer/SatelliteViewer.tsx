"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Satellite, Search, Loader2, MapPin, Thermometer, Droplets, Wind, CloudRain } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";

interface CidadeBrasil {
  id: number;
  nome: string;
  microrregiao: {
    mesorregiao: {
      UF: {
        sigla: string;
        nome: string;
      };
    };
  };
}

// Cidades principais como fallback
const cidadesPrincipais: CidadeBrasil[] = [
  {
    id: 3550308,
    nome: "São Paulo",
    microrregiao: {
      mesorregiao: {
        UF: {
          sigla: "SP",
          nome: "São Paulo"
        }
      }
    }
  },
  {
    id: 3304557,
    nome: "Rio de Janeiro",
    microrregiao: {
      mesorregiao: {
        UF: {
          sigla: "RJ",
          nome: "Rio de Janeiro"
        }
      }
    }
  },
  {
    id: 3106200,
    nome: "Belo Horizonte",
    microrregiao: {
      mesorregiao: {
        UF: {
          sigla: "MG",
          nome: "Minas Gerais"
        }
      }
    }
  },
  {
    id: 4106902,
    nome: "Curitiba",
    microrregiao: {
      mesorregiao: {
        UF: {
          sigla: "PR",
          nome: "Paraná"
        }
      }
    }
  },
  {
    id: 4314902,
    nome: "Porto Alegre",
    microrregiao: {
      mesorregiao: {
        UF: {
          sigla: "RS",
          nome: "Rio Grande do Sul"
        }
      }
    }
  },
  {
    id: 2304400,
    nome: "Fortaleza",
    microrregiao: {
      mesorregiao: {
        UF: {
          sigla: "CE",
          nome: "Ceará"
        }
      }
    }
  },
  {
    id: 2927408,
    nome: "Salvador",
    microrregiao: {
      mesorregiao: {
        UF: {
          sigla: "BA",
          nome: "Bahia"
        }
      }
    }
  },
  {
    id: 5300108,
    nome: "Brasília",
    microrregiao: {
      mesorregiao: {
        UF: {
          sigla: "DF",
          nome: "Distrito Federal"
        }
      }
    }
  },
  {
    id: 2611606,
    nome: "Recife",
    microrregiao: {
      mesorregiao: {
        UF: {
          sigla: "PE",
          nome: "Pernambuco"
        }
      }
    }
  },
  {
    id: 1302603,
    nome: "Manaus",
    microrregiao: {
      mesorregiao: {
        UF: {
          sigla: "AM",
          nome: "Amazonas"
        }
      }
    }
  }
];

interface CoordenadaCidade {
  latitude: number;
  longitude: number;
}

interface AQIResponse {
  latitude: number;
  longitude: number;
  aqi_original: number;
  aqi_personalizado: number;
  nivel_alerta: string;
  usuario_id: number;
  clima: {
    cidade: string;
    temperatura: number;
    umidade: number;
    vento: number;
    descricao: string;
    chuva_mm: number;
    neve_mm: number;
  };
}

export function SatelliteViewer() {
  const [cidades, setCidades] = useState<CidadeBrasil[]>([]);
  const [estados, setEstados] = useState<{sigla: string; nome: string}[]>([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState<string>("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState<string>("");
  const [cidadesFiltradas, setCidadesFiltradas] = useState<CidadeBrasil[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(true);
  const [loadingAQI, setLoadingAQI] = useState(false);
  const [dadosAQI, setDadosAQI] = useState<AQIResponse | null>(null);
  const [erro, setErro] = useState<string>("");

  // Carregar cidades do Brasil via API do IBGE
  useEffect(() => {
    const carregarCidades = async () => {
      try {
        setLoadingCidades(true);
        setErro('');
        console.log('🔄 Iniciando carregamento das cidades...');
        
        // Primeira tentativa: API do IBGE com configurações otimizadas
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios', {
          method: 'GET',
          mode: 'cors',
          cache: 'default',
          headers: {
            'Accept': 'application/json',
          },
          // Removendo timeout muito restritivo
        });
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);
        console.log('📡 Response headers:', response.headers);
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }
        
        // Verificar se há conteúdo na resposta
        const contentLength = response.headers.get('content-length');
        console.log('📡 Content length:', contentLength);
        
        const text = await response.text();
        console.log('📡 Response text length:', text.length);
        console.log('📡 Response preview:', text.substring(0, 200));
        
        if (!text || text.trim() === '') {
          throw new Error('Resposta vazia da API do IBGE');
        }
        
        let data: CidadeBrasil[];
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('❌ Erro ao fazer parse JSON:', parseError);
          throw new Error('Erro ao processar dados da API');
        }
        
        console.log('✅ Dados parseados:', data?.length || 0, 'cidades');
        
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('Dados inválidos ou vazios da API');
        }
        
        // Verificar estrutura dos primeiros itens
        console.log('🔍 Estrutura da primeira cidade:', data[0]);
        
        // Filtrar cidades com estrutura válida
        const cidadesValidas = data.filter(cidade => {
          return cidade && 
                 cidade.nome && 
                 cidade.microrregiao && 
                 cidade.microrregiao.mesorregiao && 
                 cidade.microrregiao.mesorregiao.UF && 
                 cidade.microrregiao.mesorregiao.UF.sigla;
        });
        
        console.log('✅ Cidades válidas filtradas:', cidadesValidas.length);
        
        if (cidadesValidas.length === 0) {
          throw new Error('Nenhuma cidade com estrutura válida encontrada');
        }
        
        // Ordenar cidades alfabeticamente
        const cidadesOrdenadas = cidadesValidas.sort((a, b) => 
          `${a.nome} - ${a.microrregiao.mesorregiao.UF.sigla}`.localeCompare(
            `${b.nome} - ${b.microrregiao.mesorregiao.UF.sigla}`
          )
        );
        
        // Extrair estados únicos das cidades
        const estadosUnicos = Array.from(
          new Set(cidadesOrdenadas.map(cidade => cidade.microrregiao.mesorregiao.UF.sigla))
        ).map(sigla => {
          const cidade = cidadesOrdenadas.find(c => c.microrregiao.mesorregiao.UF.sigla === sigla);
          return {
            sigla: sigla,
            nome: cidade?.microrregiao.mesorregiao.UF.nome || sigla
          };
        }).sort((a, b) => a.nome.localeCompare(b.nome));
        
        setCidades(cidadesOrdenadas);
        setEstados(estadosUnicos);
        console.log('🎉 Cidades carregadas com sucesso:', cidadesOrdenadas.length);
        console.log('🏛️ Estados extraídos:', estadosUnicos.length);
        
      } catch (error: any) {
        console.error('❌ Erro detalhado ao carregar cidades:', error);
        console.log('📋 Usando cidades principais como fallback...');
        
        // Usar cidades principais como fallback
        const cidadesOrdenadas = cidadesPrincipais.sort((a, b) => 
          `${a.nome} - ${a.microrregiao.mesorregiao.UF.sigla}`.localeCompare(
            `${b.nome} - ${b.microrregiao.mesorregiao.UF.sigla}`
          )
        );
        
        // Extrair estados das cidades principais
        const estadosUnicos = Array.from(
          new Set(cidadesOrdenadas.map(cidade => cidade.microrregiao.mesorregiao.UF.sigla))
        ).map(sigla => {
          const cidade = cidadesOrdenadas.find(c => c.microrregiao.mesorregiao.UF.sigla === sigla);
          return {
            sigla: sigla,
            nome: cidade?.microrregiao.mesorregiao.UF.nome || sigla
          };
        }).sort((a, b) => a.nome.localeCompare(b.nome));
        
        setCidades(cidadesOrdenadas);
        setEstados(estadosUnicos);
        setErro(`Erro ao carregar todas as cidades: ${error.message}. Usando cidades principais.`);
      } finally {
        setLoadingCidades(false);
      }
    };

    carregarCidades();
  }, []);

  // Função para recarregar cidades manualmente
  const recarregarCidades = async () => {
    if (loadingCidades) return;
    
    setLoadingCidades(true);
    setErro('');
    
    try {
      console.log('🔄 Recarregando cidades manualmente...');
      
      const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios', {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const text = await response.text();
      if (!text) {
        throw new Error('Resposta vazia');
      }
      
      const data: CidadeBrasil[] = JSON.parse(text);
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Dados inválidos da API');
      }
      
      const cidadesValidas = data.filter(cidade => 
        cidade && cidade.nome && cidade.microrregiao?.mesorregiao?.UF?.sigla
      );
      
      const cidadesOrdenadas = cidadesValidas.sort((a, b) => 
        `${a.nome} - ${a.microrregiao.mesorregiao.UF.sigla}`.localeCompare(
          `${b.nome} - ${b.microrregiao.mesorregiao.UF.sigla}`
        )
      );
      
      // Extrair estados únicos
      const estadosUnicos = Array.from(
        new Set(cidadesOrdenadas.map(cidade => cidade.microrregiao.mesorregiao.UF.sigla))
      ).map(sigla => {
        const cidade = cidadesOrdenadas.find(c => c.microrregiao.mesorregiao.UF.sigla === sigla);
        return {
          sigla: sigla,
          nome: cidade?.microrregiao.mesorregiao.UF.nome || sigla
        };
      }).sort((a, b) => a.nome.localeCompare(b.nome));
      
      setCidades(cidadesOrdenadas);
      setEstados(estadosUnicos);
      console.log('✅ Cidades recarregadas com sucesso:', cidadesOrdenadas.length);
      
    } catch (error: any) {
      console.error('❌ Erro ao recarregar:', error);
      setErro(`Erro ao recarregar cidades: ${error.message}`);
    } finally {
      setLoadingCidades(false);
    }
  };

  // Filtrar cidades por estado selecionado
  useEffect(() => {
    if (estadoSelecionado && cidades.length > 0) {
      const cidadesDoEstado = cidades.filter(
        cidade => cidade.microrregiao.mesorregiao.UF.sigla === estadoSelecionado
      );
      setCidadesFiltradas(cidadesDoEstado);
      console.log(`🏛️ Cidades filtradas para ${estadoSelecionado}:`, cidadesDoEstado.length);
    } else {
      setCidadesFiltradas([]);
    }
    // Limpar cidade selecionada quando mudar o estado
    setCidadeSelecionada("");
  }, [estadoSelecionado, cidades]);

  // Obter coordenadas de uma cidade
  const obterCoordenadas = async (nomeCidade: string, uf: string): Promise<CoordenadaCidade | null> => {
    try {
      // Usar API do Nominatim (OpenStreetMap) para obter coordenadas
      const query = `${nomeCidade}, ${uf}, Brazil`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter coordenadas:', error);
      return null;
    }
  };

  // Buscar dados de AQI
  const buscarDadosAQI = async () => {
    if (!cidadeSelecionada) {
      setErro('Selecione uma cidade primeiro');
      return;
    }

    try {
      setLoadingAQI(true);
      setErro('');
      
      // Encontrar a cidade selecionada
      const cidade = cidades.find(c => c.id.toString() === cidadeSelecionada);
      if (!cidade) {
        setErro('Cidade não encontrada');
        return;
      }

      // Obter coordenadas da cidade
      const coordenadas = await obterCoordenadas(
        cidade.nome, 
        cidade.microrregiao.mesorregiao.UF.sigla
      );
      
      if (!coordenadas) {
        setErro('Não foi possível obter as coordenadas da cidade');
        return;
      }

      // Fazer GET para o backend com query parameters
      const response = await api.get('/airmonitor/monitor/aqi', {
        params: {
          lat: coordenadas.latitude,
          lon: coordenadas.longitude,
          usuario_id: 1
        }
      });

      setDadosAQI(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar dados de AQI:', error);
      setErro(error.response?.data?.message || 'Erro ao buscar dados de qualidade do ar');
    } finally {
      setLoadingAQI(false);
    }
  };

  const getNivelAlertaColor = (nivel: string) => {
    switch (nivel.toLowerCase()) {
      case 'bom':
      case 'boa':
        return 'bg-green-500';
      case 'moderado':
      case 'moderada':
        return 'bg-yellow-500';
      case 'ruim':
      case 'inadequada':
        return 'bg-orange-500';
      case 'muito ruim':
      case 'muito inadequada':
        return 'bg-red-500';
      case 'péssimo':
      case 'péssima':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Satellite className="h-5 w-5" />
          Monitor de Qualidade do Ar por Cidade
        </CardTitle>
        <CardDescription>
          Selecione uma cidade brasileira para monitorar a qualidade do ar e condições climáticas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seletores de Estado e Cidade */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Seletor de Estado */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Primeiro, selecione o estado</label>
              {cidades.length <= 20 && !loadingCidades && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={recarregarCidades}
                  className="text-xs h-6 px-2"
                  disabled={loadingCidades}
                >
                  {loadingCidades ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : null}
                  Carregar todos
                </Button>
              )}
            </div>
            <Select 
              value={estadoSelecionado} 
              onValueChange={setEstadoSelecionado}
              disabled={loadingCidades}
            >
              <SelectTrigger>
                {loadingCidades ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Carregando estados...
                  </div>
                ) : (
                  <SelectValue placeholder="Selecione um estado" />
                )}
              </SelectTrigger>
              <SelectContent>
                {estados.map((estado) => (
                  <SelectItem key={estado.sigla} value={estado.sigla}>
                    {estado.nome} ({estado.sigla})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {cidades.length <= 20 && (
              <p className="text-xs text-muted-foreground mt-1">
                {estados.length} estados ({cidades.length <= 10 ? 'principais apenas' : 'completo'})
              </p>
            )}
          </div>

          {/* Seletor de Cidade */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Depois, selecione a cidade
              {estadoSelecionado && cidadesFiltradas.length > 0 && (
                <span className="text-muted-foreground ml-1">
                  ({cidadesFiltradas.length} disponíveis)
                </span>
              )}
            </label>
            <Select 
              value={cidadeSelecionada} 
              onValueChange={setCidadeSelecionada}
              disabled={loadingCidades || !estadoSelecionado || cidadesFiltradas.length === 0}
            >
              <SelectTrigger>
                <SelectValue 
                  placeholder={
                    !estadoSelecionado 
                      ? "Selecione um estado primeiro" 
                      : cidadesFiltradas.length === 0 
                        ? "Nenhuma cidade disponível"
                        : "Selecione uma cidade"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {cidadesFiltradas.map((cidade) => (
                  <SelectItem key={cidade.id} value={cidade.id.toString()}>
                    {cidade.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {estadoSelecionado && cidadesFiltradas.length === 0 && !loadingCidades && (
              <p className="text-xs text-muted-foreground mt-1">
                Nenhuma cidade encontrada para {estadoSelecionado}
              </p>
            )}
          </div>
        </div>

        {/* Botão de Busca */}
        <div className="flex justify-center">
          <Button 
            onClick={buscarDadosAQI}
            disabled={!cidadeSelecionada || loadingAQI}
            className="flex items-center gap-2 px-8"
            size="lg"
          >
            {loadingAQI ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Buscar
          </Button>
        </div>

        {/* Mensagem de Erro */}
        {erro && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
            {erro}
          </div>
        )}

        {/* Dados de AQI */}
        {dadosAQI && (
          <div className="space-y-4">
            {/* Informações de Localização */}
            <div className="flex items-center gap-2 text-lg font-semibold">
              <MapPin className="h-5 w-5" />
              {dadosAQI.clima.cidade}
            </div>

            {/* Cards de AQI */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">AQI Original</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{dadosAQI.aqi_original}</span>
                    <Badge className={getNivelAlertaColor(dadosAQI.nivel_alerta)}>
                      {dadosAQI.nivel_alerta}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">AQI Personalizado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{dadosAQI.aqi_personalizado}</span>
                    <Badge variant="outline">Personalizado</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Informações Climáticas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Condições Climáticas</CardTitle>
                <CardDescription>{dadosAQI.clima.descricao}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Temperatura</p>
                      <p className="font-semibold">{dadosAQI.clima.temperatura}°C</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Umidade</p>
                      <p className="font-semibold">{dadosAQI.clima.umidade}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Wind className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Vento</p>
                      <p className="font-semibold">{dadosAQI.clima.vento} km/h</p>
                    </div>
                  </div>
                  
                  {dadosAQI.clima.chuva_mm > 0 && (
                    <div className="flex items-center gap-3">
                      <CloudRain className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Chuva</p>
                        <p className="font-semibold">{dadosAQI.clima.chuva_mm} mm</p>
                      </div>
                    </div>
                  )}
                  
                  {dadosAQI.clima.neve_mm > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 bg-gray-300 rounded-full" />
                      <div>
                        <p className="text-sm text-muted-foreground">Neve</p>
                        <p className="font-semibold">{dadosAQI.clima.neve_mm} mm</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Coordenadas */}
            <div className="text-xs text-muted-foreground text-center">
              Coordenadas: {dadosAQI.latitude.toFixed(4)}, {dadosAQI.longitude.toFixed(4)}
            </div>
          </div>
        )}

        {/* Estado inicial quando não há dados */}
        {!dadosAQI && !erro && !loadingAQI && (
          <div className="text-center py-12">
            <Satellite className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-semibold mb-2">Monitor de Qualidade do Ar</p>
            <p className="text-muted-foreground max-w-md mx-auto">
              Selecione uma cidade brasileira e clique em "Buscar" para visualizar 
              os dados de qualidade do ar e condições climáticas em tempo real.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
