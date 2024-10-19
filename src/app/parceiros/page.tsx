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
import listaParceiros from "@/data/listaParceiros.json";
// import { IParceiro } from '@/types/parceiro';
// import { useState } from 'react';

export default function Parceiros() { 

  const lista  = listaParceiros;


  return (
    <div className={Style.page}>
      <GridCard 
      parceiros={lista}
      />
    </div>
  );
};
