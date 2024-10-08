'use client';

import Formulario from '../Formulario';
import Redes from '../Redes';
import Style from './Contato.module.scss';


const Contato = () => { 

  return (
    <div className={Style.contato}>
      <Formulario />
      <Redes />
    </div>
  )
};

export default Contato;
