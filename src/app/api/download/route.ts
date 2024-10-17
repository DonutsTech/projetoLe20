import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    // Parseando o corpo da requisição
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL não fornecida' }, { status: 400 });
    }

    // Fazendo a requisição para o S3 usando a URL fornecida
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/pdf',
      },
    });

    // Convertendo o arquivo PDF em base64
    const base64 = Buffer.from(response.data, 'binary').toString('base64');

    // Definindo os headers de CORS
    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type');

    // Respondendo com o conteúdo base64
    return NextResponse.json({ fileContent: base64 }, { headers: responseHeaders });

  } catch (error) {
    console.error('Erro ao baixar o arquivo:', error);
    return NextResponse.json({ error: 'Erro ao baixar o arquivo' }, { status: 500 });
  }
}

// Adicionando o handler para o método OPTIONS para lidar com preflight requests (CORS)
export async function OPTIONS() {
  const responseHeaders = new Headers();
  responseHeaders.set('Access-Control-Allow-Origin', '*');
  responseHeaders.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type');

  return new Response(null, { headers: responseHeaders });
}
