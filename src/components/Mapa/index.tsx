'use client';

import Image from 'next/image';
import Style from './Mapa.module.scss';
import MapaMG from '/public/assets/images/Mapa02.svg';

const Mapa = () => {

  return (
    <div className={Style.mapa}>
      <Image src={MapaMG} alt='Mapa MG' className={Style.mapaImg} />
    </div>
  )
};

export default Mapa;
