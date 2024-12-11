import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

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
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/pdf',
            },
            maxContentLength: 50 * 1024 * 1024, // Limite para o conteúdo (50MB)
            maxBodyLength: 50 * 1024 * 1024, // Limite para o corpo da requisição (50MB)
            timeout: 60000, // Timeout de 60 segundos
        });

        console.log('Resposta recebida do S3:', response.status); // Adicionando log

        // Convertendo o arquivo PDF em base64
        const base64 = Buffer.from(response.data).toString('base64');

        // Definindo os headers de CORS
        const responseHeaders = new Headers();
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        responseHeaders.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type');
        responseHeaders.set('Content-Type', 'application/json');

        // Respondendo com o conteúdo base64
        return NextResponse.json({ fileContent: base64 }, { headers: responseHeaders });

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
