import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL não fornecida' }, { status: 400 });
    }

    // Extrai o ID do arquivo do URL do Google Drive
    const fileId = extractFileId(url);

    if (!fileId) {
      return NextResponse.json({ error: 'URL do Google Drive inválida' }, { status: 400 });
    }

    // URL para download direto do Google Drive
    const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    // Faz o download do arquivo
    const response = await axios.get(directDownloadUrl, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/pdf',
      },
    });

    // Converte o arquivo para Base64
    const base64 = Buffer.from(response.data, 'binary').toString('base64');

    return NextResponse.json({ fileContent: base64 });
  } catch (error) {
    console.error('Erro ao baixar o arquivo:', error);
    return NextResponse.json({ error: 'Erro ao baixar o arquivo' }, { status: 500 });
  }
}

function extractFileId(url: string): string | null {
  const regex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}