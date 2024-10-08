import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Erro na verificação do transportador:', error);
  } else {
    console.log('Transportador pronto para enviar e-mails:', success);
  }
});

export async function POST(request: Request) {
  const data = await request.json();
  const { nome, email, telefone, CEP, mensagem, enderecoCompleto, cnpj, cnpjData } = data;


  const razaoSocial = cnpjData.razao_social;
  const nomeFantasia = cnpjData.nome_fantasia;
  const dataFundacao = formatDate(cnpjData.data_fundacao);
  const status = cnpjData.status;
  const dataStatus = formatDate(cnpjData.statusDate);
  const atividadePrincipal = cnpjData.atividade_principal;
  const socios = cnpjData.socios;

  const rua = enderecoCompleto.rua || 'Não disponível';
  const bairro = enderecoCompleto.bairro || 'Não disponível';
  const cidade = enderecoCompleto.localidade || 'Não disponível';
  const estado = enderecoCompleto.estado || 'Não disponível';

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Novo Formulário do Site: de ${nome}`,
    text: `
      Nome: ${nome}
      Email: ${email}
      Telefone: ${telefone}
      CNPJ: ${cnpj || 'Não fornecido'}
      Endereço Completo:
      - Rua: ${rua}
      - Bairro: ${bairro}
      - Cidade: ${cidade}
      - Estado: ${estado}
      - CEP: ${CEP}

      Dados do CNPJ:
      - Razão Social: ${razaoSocial}
      - Nome Fantasia: ${nomeFantasia}
      - Data de Fundação: ${dataFundacao}
      - Status: ${status}
      - Data do Status: ${dataStatus}
      - Atividade Principal: ${atividadePrincipal}
      - Sócios: ${socios}

      Mensagem: ${mensagem || 'Sem mensagem'}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email enviado com sucesso!' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao enviar o email:', error);
    return NextResponse.json({ message: 'Erro ao enviar o email.' }, { status: 500 });
  }
}

function formatDate(dateString: string): string {
  if (!dateString) {
    return 'Data não disponível';
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Data inválida';
  }
  
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  
  return `${dia}/${mes}/${ano}`;
}
