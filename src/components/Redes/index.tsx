'use client';

import Style from './Redes.module.scss';
import local from '/public/assets/icon/local_contatos.svg';
import email from '/public/assets/icon/email_contatos.svg';
import whatsapp from '/public/assets/icon/whatsapp_contatos.svg';
import linkedin from '/public/assets/icon/linkedin_contatos.svg';
import instagram from '/public/assets/icon/instagram_contatos.svg';
import Image from 'next/image';


const Redes = () => {

  const redes = [
    {
      titulo: 'Venha nos visitar!',
      imagem: local,
      link: 'https://maps.app.goo.gl/WoLk4nscWErCy7sw7',
      text: 'Rua Marcos Alves Barbosa, 115- Santa Luzia - Uberlândia - MG',
    },
    {
      titulo: 'Entre em contato!',
      imagem: email,
      link: 'mailto:lucia@le20rep.com',
      text: 'lucia@le20rep.com',
    },
    {
      titulo: 'Me chame no Whatsapp',
      imagem: whatsapp,
      link: 'https://wa.me/5534991278990',
      text: '(34) 9.9127-8990',
    },
    {
      titulo: 'Acesse meu Linkedin',
      imagem: linkedin,
      link: 'https://www.linkedin.com/in/',
      text: 'linkedin.com/in/',
    },
    {
      titulo: 'Acesse meu Instagram',
      imagem: instagram,
      link: 'https://www.instagram.com/le20rep/',
      text: '@le20rep',
    },
  ]

  return (
    <div className={Style.redes}>
      <div className={Style.redesContainer}>
        <h3 className={Style.tituloChamada}>Brinquedos e material escolar? <br />A Le20 Representações tem a solução!</h3>
        <p className={Style.textChamada}>Conte com a expertise da Le20 para turbinar suas vendas e garantir o sucesso do seu negócio.<br />
          Entre em contato e descubra como podemos te ajudar!</p>

        <div className={Style.redesLinks}>
          {redes.map((item, index) =>
            <div key={index} className={Style.redeBox}>
              <a href={item.link} target="_blank" rel="noreferrer" title={item.titulo}>
                <Image src={item.imagem} alt='icon' className={Style.icon} />
              </a>
              <p className={Style.text}>{item.text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
};

export default Redes;
