import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_CHATBOT_URL = 'https://gustavo-production-08e9.up.railway.app/airquality/chatbot/';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(EXTERNAL_CHATBOT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error('proxy error', err);
    return NextResponse.json({ error: 'proxy_error', message: err.message || String(err) }, { status: 500 });
  }
}

export async function OPTIONS() {
  // Support preflight from browser
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
