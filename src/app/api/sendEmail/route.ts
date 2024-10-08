import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
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
  const { nome, email, telefone, CEP, mensagem, enderecoCompleto } = data;

  const mailOptions = {
    from: 'lucia@le20rep.com',
    to: 'lucia@le20rep.com',
    subject: `Novo Formulário do Site: de ${nome}`,
    text:`
      Nome: ${nome}
      Email: ${email}
      Telefone: ${telefone}
      Endereço Completo:
      - Logradouro: ${enderecoCompleto.logradouro}
      - Bairro: ${enderecoCompleto.bairro}
      - Cidade: ${enderecoCompleto.localidade}
      - Estado: ${enderecoCompleto.estado}
      - CEP: ${CEP}

      
      Mensagem: ${mensagem}
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
