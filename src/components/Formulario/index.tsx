'use client';

import { useEffect, useState } from 'react';
import Style from './Formulario.module.scss';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createText } from '@/utils/mensagem';
import { sendMail } from '@/lib/fetchData';

const schema = z.object({
  nome: z.string().nonempty('Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, 'Telefone inválido'),
  CEP: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
  cnpj: z.string()
    .optional()
    .refine((val) => val !== undefined && !(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(val)), 'CNPJ inválido'),
  mensagem: z.string().optional(),
});

export type FormData = z.infer<typeof schema>;

export interface Endereco {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  complemento?: string;
}

interface ViaCEPErro {
  erro: boolean;
}

type ViaCEPResponse = Endereco | ViaCEPErro;

export interface CNPJData {
  company: {
    name: string;
    members: {
      person: {
        name: string;
      };
    }[];
  };
  alias: string;
  founded: string;
  status: {
    text: string;
  };
  statusDate: string;
  mainActivity: {
    text: string;
  };
}

const isViaCEPErro = (data: ViaCEPResponse): data is ViaCEPErro => {
  return (data as ViaCEPErro).erro !== undefined;
};

const Formulario = () => {
  const fetchEndereco = async (cep: string): Promise<Endereco | null> => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data: ViaCEPResponse = await response.json();

      if (isViaCEPErro(data)) {
        console.log('Cep não encontrado.');
        return null;
      }

      return data as Endereco;
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      return null;
    }
  };

  const fetchCNPJData = async (cnpj: string | undefined) => {
    if (!cnpj) return null;

    try {
      const response = await fetch(`https://open.cnpja.com/office/${cnpj}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar informações do CNPJ:', error);
      return null;
    }
  };


  const formatTelefone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const formatCEP = (value: string) => {
    return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 9);
  };

  const formatCNPJ = (value: string) => {
    return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [CEP, setCEP] = useState('');
  const [cnpj, setCNPJ] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enderecoCompleto, setEnderecoCompleto] = useState<Endereco | null>(null);
  const [cnpjData, setCNPJData] = useState<CNPJData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensagemApi, setMensagemApi] = useState('');

  useEffect(() => {
    setTimeout(() => {
      if (mensagemApi) {
        setMensagemApi('')
      }
    }, 10000);
  }, [mensagemApi]);

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;


    switch (name) {
      case 'nome':
        setNome(value);
        break;
      case 'email':
          setEmail(value);
          break;
      case 'telefone':
        setTelefone(formatTelefone(value));
        break;
      case 'CEP':
        const formattedCEP = formatCEP(value);
        setCEP(formattedCEP);

        if (formattedCEP.length === 9) {
          const endereco = await fetchEndereco(formattedCEP.replace('-', ''));
          if (endereco) {
            setEnderecoCompleto(endereco);
          }
        }
        break;
      case 'cnpj':
        const formattedCNPJ = formatCNPJ(value);
        setCNPJ(formattedCNPJ);

        if (formattedCNPJ.replace(/\D/g, '').length === 14) {
          const cnpjInfo = await fetchCNPJData(formattedCNPJ.replace(/\D/g, ''));
          console.log(cnpjInfo)
          if (cnpjInfo) {
            setCNPJData(cnpjInfo);
          }
        } else if (formattedCNPJ === '') {
          setCNPJData(null);
        }
        break;
      case 'mensagem':
        setMensagem(value.replace(/\n/g, ' '));
        break;
      default:
        break;
    }
  };

  const calculateFoundationYears = (foundedDate: string) => {
    const founded = new Date(foundedDate);
    const currentYear = new Date().getFullYear();
    return currentYear - founded.getFullYear();
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const texto: string = createText({
          ...data,
          enderecoCompleto: {
            localidade: enderecoCompleto?.localidade || '',
            estado: enderecoCompleto?.uf || '',
            bairro: enderecoCompleto?.bairro || '',
            rua: enderecoCompleto?.logradouro || '',
          },
          cnpjData: cnpjData ? {
            razao_social: cnpjData.company.name,
            nome_fantasia: cnpjData.alias,
            data_fundacao: cnpjData.founded,
            anos_fundacao: calculateFoundationYears(cnpjData.founded),
            status: cnpjData.status.text,
            statusDate: cnpjData.statusDate,
            atividade_principal: cnpjData.mainActivity.text,
            socios: cnpjData.company.members.map((socio) => socio.person.name).join(',\n')
          } : null
        })

      const resp = await sendMail(texto, data.nome)


      if (resp === 'Mensagem não enviada. Contate-nos por telefone.') {
        setMensagemApi(resp)
      }

      if (resp === 'Mensagem Recebida Com Sucesso!') {
        reset();
        setNome('');
        setEmail('');
        setTelefone('');
        setCEP('');
        setCNPJ('');
        setMensagem('');
        setEnderecoCompleto(null);
        setCNPJData(null);
        setMensagemApi(resp)
      }
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
      setMensagemApi('Mensagem não enviada. Contate-nos por telefone.')
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={Style.formulario} onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className={Style.item}>
        <label htmlFor="nome">Nome*</label>
        <input
          id="nome"
          type="text"
          placeholder="Nome"
          {...register('nome')}
          name='nome'
          value={nome}
          onChange={handleInputChange}
          autoComplete="new-password"
        />
        {errors.nome?.message && <span className={Style.error}>{String(errors.nome.message)}</span>}
      </div>
      <div className={Style.item}>
        <label htmlFor="email">Email*</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          {...register('email')}
          name='email'
          value={email}
          onChange={handleInputChange}
        />
        {errors.email?.message && <span className={Style.error}>{String(errors.email.message)}</span>}
      </div>
      <div className={Style.item}>
        <label htmlFor="telefone">Celular*</label>
        <input
          id="telefone"
          type="text"
          placeholder="Somente os números com o ddd"
          {...register('telefone')}
          name='telefone'
          value={telefone}
          onChange={handleInputChange}
          autoComplete="new-password"
        />
        {errors.telefone?.message && <span className={Style.error}>{String(errors.telefone.message)}</span>}
      </div>
      <div className={Style.item}>
        <label htmlFor="CEP">CEP*</label>
        <input
          id="CEP"
          type="text"
          placeholder="CEP- Somente os números"
          {...register('CEP')}
          value={CEP}
          name='CEP'
          onChange={handleInputChange}
          autoComplete="new-password"
        />
        {errors.CEP?.message && <span className={Style.error}>{String(errors.CEP.message)}</span>}
      </div>
      <div className={Style.item}>
        <label htmlFor="cnpj">CNPJ</label>
        <input
          id="cnpj"
          type="text"
          placeholder="CNPJ- Somente os números"
          {...register('cnpj')}
          value={cnpj}
          name='cnpj'
          onChange={handleInputChange}
          autoComplete="off"
        />
        {errors.cnpj?.message && <span className={Style.error}>{String(errors.cnpj.message)}</span>}
      </div>
      <div className={Style.item}>
        <label htmlFor="mensagem">Mensagem</label>
        <textarea
          id="mensagem"
          placeholder="Mensagem"
          {...register('mensagem')}
          name='mensagem'
          value={mensagem}
          onChange={handleInputChange}
          autoComplete="off"
        />
      </div>
      <span className={Style.message}>* campos obrigatórios</span>
      {
        !(mensagemApi === '') && (
          <p>{mensagemApi}</p>
        )
      }
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
};

export default Formulario;
