import axios from 'axios';
import { NextResponse } from 'next/server';

type Body = {
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  razaosocial: string;
  nomefantasia: string;
  datafuncao: string;
  status: string;
  datastatus: string;
  atividade: string;
  socios: string;
  mensagem: string;
}


export default async function sendWhatsapp(dados: Body) {
    try {
    if (!dados) {
        return NextResponse.json({ message: 'Erro ao enviar.' }, { status: 500 });
    }

    await axios({
      url: 'https://graph.facebook.com/v21.0/442465622289459/messages',
      method: 'post',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`, // Substitua com o seu token de ambiente
        'Content-Type': 'application/json',
      },
      data: {
        messaging_product: 'whatsapp',
        to: `${process.env.TEL}`,
        type: 'template',
        template: {
          name: 'mensagem_informacao',
          language: { code: 'pt_BR' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: dados.nome },
                { type: 'text', text: dados.email },
                { type: 'text', text: dados.telefone },
                { type: 'text', text: dados.cnpj },
                { type: 'text', text: dados.rua },
                { type: 'text', text: dados.bairro },
                { type: 'text', text: dados.cidade },
                { type: 'text', text: dados.estado },
                { type: 'text', text: dados.cep },
                { type: 'text', text: dados.razaosocial },
                { type: 'text', text: dados.nomefantasia },
                { type: 'text', text: dados.datafuncao},
                { type: 'text', text: dados.status },
                { type: 'text', text: dados.datastatus },
                { type: 'text', text: dados.atividade },
                { type: 'text', text: dados.socios },
                { type: 'text', text: dados.mensagem },
              ]
            }
          ]
        },
      },
    });

    return NextResponse.json({ message: 'Email enviado com sucesso!' }, { status: 200 });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Erro ao enviar o email.' }, { status: 500 });
  }
}