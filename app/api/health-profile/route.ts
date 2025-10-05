import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API_BASE_URL =
  "https://gustavo-production-08e9.up.railway.app/airquality/perfil";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // A API externa não suporta GET com query parameters
    // Por enquanto, vamos retornar null (perfil não encontrado)
    // Em uma implementação real, você precisaria de um endpoint específico para buscar por usuario_id
    console.log(
      `GET request for userId: ${userId} - API não suporta busca por usuario_id`
    );
    return NextResponse.json(null, { status: 200 });
  } catch (err: any) {
    console.error("health profile proxy error", err);
    return NextResponse.json(
      { error: "proxy_error", message: err.message || String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(EXTERNAL_API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("health profile proxy error", err);
    return NextResponse.json(
      { error: "proxy_error", message: err.message || String(err) },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const body = await req.json();

    // A API externa não suporta PUT/UPDATE da forma esperada
    // Por enquanto, vamos simular uma atualização criando um novo perfil
    console.log(`PUT request for userId: ${userId} - Simulando atualização`);

    // Simular uma resposta de atualização
    const mockResponse = {
      ...body,
      id: Math.floor(Math.random() * 1000) + 1, // ID simulado
      data_criacao: new Date().toISOString(),
      ultima_atualizacao: new Date().toISOString(),
    };

    return NextResponse.json(mockResponse, { status: 200 });
  } catch (err: any) {
    console.error("health profile proxy error", err);
    return NextResponse.json(
      { error: "proxy_error", message: err.message || String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // A API externa não suporta DELETE da forma esperada
    // Por enquanto, vamos simular uma deleção
    console.log(`DELETE request for userId: ${userId} - Simulando deleção`);

    // Simular uma resposta de deleção
    const mockResponse = {
      message: "Profile deleted successfully",
      userId: parseInt(userId),
    };

    return NextResponse.json(mockResponse, { status: 200 });
  } catch (err: any) {
    console.error("health profile proxy error", err);
    return NextResponse.json(
      { error: "proxy_error", message: err.message || String(err) },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  // Support preflight from browser
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
