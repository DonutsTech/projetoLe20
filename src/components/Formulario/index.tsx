'use client';

import { useState } from 'react';
import Style from './Formulario.module.scss';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  nome: z.string().nonempty('Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, 'Telefone inválido'),
  CEP: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
  mensagem: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Endereco {
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
      console.log('Erro ao buscar o endereço, tente novamente.');
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

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [CEP, setCEP] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enderecoCompleto, setEnderecoCompleto] = useState<Endereco | null>(null); 

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
            console.log('Endereço completo: ', endereco);
          }
        }
        break;
      case 'mensagem':
        setMensagem(value.replace(/\n/g, ' '));
        break;
      default:
        break;
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          enderecoCompleto: {
            logradouro: enderecoCompleto?.logradouro || '',
            localidade: enderecoCompleto?.localidade || '',
            estado: enderecoCompleto?.uf || '',
            bairro: enderecoCompleto?.bairro || '',
            rua: enderecoCompleto?.logradouro || '',
          },
        }),
      });

      const result = await response.json();
      console.log(result.message);
      reset();
      setNome('');
      setEmail('');
      setTelefone('');
      setCEP('');
      setMensagem('');
      setEnderecoCompleto(null);
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
    }
  };

  return (
    <form className={Style.formulario} onSubmit={handleSubmit(onSubmit)}>
      <div className={Style.item}>
        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          id="nome"
          placeholder="Nome"
          {...register('nome')}
          value={nome}
          onChange={handleInputChange}
        />
        {errors.nome?.message && <span className={Style.error}>{String(errors.nome.message)}</span>}
      </div>
      <div className={Style.item}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          {...register('email')}
          value={email}
          onChange={handleInputChange}
        />
        {errors.email?.message && <span className={Style.error}>{String(errors.email.message)}</span>}
      </div>
      <div className={Style.item}>
        <label htmlFor="telefone">Telefone</label>
        <input
          type="tel"
          id="telefone"
          placeholder="Telefone"
          {...register('telefone')}
          value={telefone}
          onChange={handleInputChange}
        />
        {errors.telefone?.message && <span className={Style.error}>{String(errors.telefone.message)}</span>}
      </div>
      <div className={Style.item}>
        <label htmlFor="CEP">CEP</label>
        <input
          type="text"
          id="CEP"
          placeholder="CEP"
          {...register('CEP')}
          value={CEP}
          onChange={handleInputChange}
        />
        {errors.CEP?.message && <span className={Style.error}>{String(errors.CEP.message)}</span>}
      </div>
      <div className={Style.item}>
        <label htmlFor="mensagem">Mensagem</label>
        <textarea
          id="mensagem"
          placeholder="Mensagem"
          {...register('mensagem')}
          value={mensagem}
          onChange={handleInputChange}
        />
        {errors.mensagem?.message && <span className={Style.error}>{String(errors.mensagem.message)}</span>}
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
};

export default Formulario;
