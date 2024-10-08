'use client';

import Blobs from '../Blobs';
import Style from './Perfil.module.scss';

const Perfil = () => { 

  return (
    <div className={Style.perfil}>
      <Blobs />
      <div className={Style.perfilTextos}>
        <h3>Lúcia Helena Bucchianeri</h3>
        <p>Há 36 anos no mercado de vendas, amo ser representante comercial. Cada dia traz novos desafios. Prefiro o contato humano das vendas face a face, que nenhuma tecnologia substitui.</p>
      </div>
    </div>
  )
};

export default Perfil;
