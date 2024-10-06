'use client'

import Image from 'next/image';
import Style from './Footer.module.scss';
import detail from '/public/assets/details/papelRasgadoClaro.png';
import logo from '/public/assets/logo/Le20_Logo_Cor_1.svg';
import local from '/public/assets/icon/local.png';
import whatsapp from '/public/assets/icon/whatsapp.svg';
import instagram from '/public/assets/icon/instagram.svg';
import donuts from '/public/assets/icon/donutsS.svg';

const Footer = () => {

  return (
    <footer className={Style.footer}>
      <Image src={detail} alt='Detalhes' className={Style.detail} />
      <div className={Style.container}>
        <Image src={logo} alt='Logo da Le20' className={Style.logo} />
        <div className={Style.social}>
          <div className={Style.endereco} >
            <a href='https://maps.app.goo.gl/WoLk4nscWErCy7sw7' title='Google Maps' target='_blank' rel='noreferrer'>
              <Image src={local} alt='Localização' className={Style.local} />
            </a>
            <p className={Style.enderecoEscritorio}>
              Rua Marcos Alves Barbosa, 115 - B. Santa Luzia -Uberlândia - MG- 38.408-696
            </p>
          </div>
          <div className={Style.rede}>
            <a href=' https://wa.me/5534991278990' title='Whatsapp' target='_blank' rel='noreferrer'>
              <Image src={whatsapp} alt='whatsapp icon' className={Style.redeLogo} />
            </a>
            <p className={Style.redeTexto}>(34) 9.9127-8990</p>
          </div>
          <div className={Style.rede}>
            <a href='https://www.instagram.com/le20rep/' title='Instagram' target='_blank' rel='noreferrer'>
              <Image src={instagram} alt='Instagram icon' className={Style.redeLogo} />
            </a>
            <p className={Style.redeTexto}>@le20rep</p>
          </div>
        </div>
        <div className={Style.copy}>
          <p className={Style.copyTexto}>
            Todos os direitos reservados || &copy; Le20 Representações || 2024
          </p>
          <div className={Style.donuts}>
            <a href='https://www.donutstech.com.br/' title='DonutsTech' target='_blank' rel='noreferrer' className={Style.donutsLink}>
              <Image src={donuts} alt='DonutsTech icon' className={Style.donutsLogo} />
            </a>
            <p className={Style.donutsTexto}>Feito com muito amor e açucar!</p>
          </div>
        </div>
      </div>
    </footer>
  )
};

export default Footer;
