export async function sendMail(text: string, nome: string): Promise<string> {
  try {
    const response = await fetch('https://fvpc9zk6oc.execute-api.us-east-1.amazonaws.com/dev/sendemail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer  ${process.env.TOKEN_EMAIL}`
      },
      body: JSON.stringify({
        name: 'Le20',
        to: `${process.env.EMAIL_USER}`,
        subject: `Novo Formulário do Site: ${nome}`,
        text: text,
      }),
    });

    const data = await response.json();

    if (data.mensagem === 'Mensagem não enviada. Contate-nos por telefone.') {
      return 'Mensagem não enviada. Contate-nos por telefone.'
    }

    return 'Email enviado com sucesso!';
  } catch (error) {
    console.error('Erro ao enviar o email:', error);
    return 'Mensagem não enviada. Contate-nos por telefone.';
  }
}

