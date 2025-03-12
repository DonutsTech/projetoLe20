export async function sendMail(text: string, nome: string): Promise<string> {
  try {
    const response = await fetch('https://fvpc9zk6oc.execute-api.us-east-1.amazonaws.com/dev/sendemail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer  wBa6i42xLa5mW1hr8zCVa4g08yke4erWK9TkBrRgfrdYFxx80Pxzt0uB39WAZdmu4vtyQdG2QCuV`
      },
      body: JSON.stringify({
        name: 'Le20',
        to: `lucia@le20rep.com`,
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

