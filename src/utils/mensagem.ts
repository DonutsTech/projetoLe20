export function createText(data: TextDTO): string {
  const { nome, email, telefone, CEP, mensagem, enderecoCompleto, cnpj, cnpjData } = data;

  const razaoSocial = `${cnpjData && cnpjData.razao_social ? cnpjData.razao_social : ''}`;
  const nomeFantasia = `${cnpjData && cnpjData.nome_fantasia ? cnpjData.nome_fantasia : ''}`;
  const dataFundacao = `${cnpjData && cnpjData.data_fundacao ? formatDate(cnpjData.data_fundacao) : ''}`;
  const status = `${cnpjData && cnpjData.status ? cnpjData.status : ''}`;
  const dataStatus = `${cnpjData && cnpjData.statusDate ? formatDate(cnpjData.statusDate) : ''}`;
  const atividadePrincipal = `${cnpjData && cnpjData?.atividade_principal ? cnpjData.atividade_principal : ''}`;
  const socios = `${cnpjData && cnpjData.socios ? cnpjData.socios : ''}`;

  const rua = `${enderecoCompleto ? enderecoCompleto.rua : 'Não disponível'}`;
  const bairro = `${enderecoCompleto ? enderecoCompleto.bairro : 'Não disponível'}`;
  const cidade = `${enderecoCompleto ? enderecoCompleto.localidade : 'Não disponível'}`;
  const estado = `${enderecoCompleto ? enderecoCompleto.estado : 'Não disponível'}`;

  return `
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
  `
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
