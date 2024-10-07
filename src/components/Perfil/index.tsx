'use client';

import Blobs from '../Blobs';
import Style from './Perfil.module.scss';

const Perfil = () => { 

  return (
    <div className={Style.perfil}>
      <Blobs />
      <div className={Style.perfilTextos}>
        <h3>Lúcia Helena Bucchianeri</h3>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis expedita at illo nihil, rerum nam, pariatur laboriosam quisquam perspiciatis sequi quas perferendis debitis veniam doloribus, ullam sunt! Harum, placeat incidunt.</p>
      </div>
    </div>
  )
};

export default Perfil;
