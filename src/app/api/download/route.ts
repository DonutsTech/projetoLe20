import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export const config = {
  api: {
    bodyParser: false, // Desativa o parser automático
  },
};

export async function POST(request: Request) {
    try {
        // Parseando o corpo da requisição
        const { url } = await request.json();
        console.log('URL recebida:', url); // Adicionando log

        // Verificando se a URL é válida
        if (!url || !/^https?:\/\//.test(url)) {
            return NextResponse.json({ error: 'URL inválida' }, { status: 400 });
        }

        // Fazendo a requisição para o S3 usando a URL fornecida
        const response = await axios.get(url, {
            responseType: 'stream',
            headers: {
                'Content-Type': 'application/pdf',
            },
        });

        const chunks: string[] = [];

        response.data.on('data', (chunk: Buffer) => {
          const base64Chunk = chunk.toString('base64');
          chunks.push(base64Chunk);
        });

        // Definindo os headers de CORS
        const responseHeaders = new Headers();
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        responseHeaders.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type');
        responseHeaders.set('Content-Type', 'application/json');

        // Respondendo com o conteúdo base64

        response.data.on('end', () => {
          const base64File = chunks.join(''); // Junta os chunks em uma única string
          return new NextResponse(
            JSON.stringify({ fileContent: base64File }),
            { status: 200, headers: responseHeaders }
          );
        });

        // Caso haja erro no stream
        response.data.on('error', (error: Error) => {
          console.error('Erro ao processar o stream:', error.message);
          return NextResponse.json({ error: 'Erro ao processar o stream' });
        });

    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error('Erro ao baixar o arquivo:', error.message);
            const status = error.response?.status || 500;
            return NextResponse.json({ error: 'Erro ao baixar o arquivo', details: error.message }, { status });
        } else {
            console.error('Erro inesperado:', error);
            return NextResponse.json({ error: 'Erro ao baixar o arquivo' }, { status: 500 });
        }
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
