"use client"
if (typeof window !== 'undefined' && !Promise.withResolvers) {
  Promise.withResolvers = function <T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

import Style from './Parceiros.module.scss';
import GridCard from '@/components/GridCard';
import Tipos from '@/components/Tipos';
import listaParceiros from "@/data/listaParceiros.json";
import { useState } from 'react';
// import { IParceiro } from '@/types/parceiro';
// import { useState } from 'react';

export default function Parceiros() {
  const [tipoSelecionado, setSelecionado] = useState<string | null>(null)

  const selecionouTipo = (nome: string | null) => {
    setSelecionado(nome === tipoSelecionado ? null : nome)
  }

  const lista  = listaParceiros;

  return (
    <div className={Style.page}>
      <Tipos tipoSelecionado={tipoSelecionado} selecionouTipo={selecionouTipo} />
      <GridCard
      parceiros={tipoSelecionado === null ? lista : lista.filter(({tips}) => tips.includes(tipoSelecionado))}
      />
    </div>
  );
};
