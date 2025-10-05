import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API_BASE_URL =
  "https://gustavo-production-08e9.up.railway.app/airquality/aqi/previsao";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    console.log(`Tentando buscar dados reais para userId: ${userId}`);
    const res = await fetch(`${EXTERNAL_API_BASE_URL}/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`Status da API externa: ${res.status}`);
    console.log(`Content-Type: ${res.headers.get("content-type")}`);

    if (res.status === 404) {
      return NextResponse.json(
        { error: "Forecast not found" },
        { status: 404 }
      );
    }

    // Tentar fazer parse do JSON
    const data = await res.json();
    console.log("✅ Dados reais obtidos com sucesso!");
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("❌ Erro ao buscar dados reais:", err);
    return NextResponse.json(
      {
        error: "api_error",
        message: err.message || String(err),
        details: "API externa indisponível",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
