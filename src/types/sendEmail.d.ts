interface TextDTO {
  nome: string | null;
  email: string | null;
  telefone: string | null;
  CEP?: string | undefined;
  mensagem?: string | undefined;
  cnpj?: string | undefined;
  enderecoCompleto: {
    localidade: string | undefined;
    estado: string | undefined;
    bairro: string | undefined;
    rua: string | undefined;
  } | null;
  cnpj: string | null;
  cnpjData: {
    razao_social: string | undefined;
    nome_fantasia: string | undefined;
    data_fundacao: string | undefined;
    anos_fundacao: number | undefined;
    status: string | undefined;
    statusDate: string | undefined;
    atividade_principal: string | undefined;
    socios: string | undefined;
  } | null;
}
