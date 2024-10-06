'use client'

import Image from 'next/image';
import Link from 'next/link';
import Style from './Menu.module.scss';
import ClassNames from 'classnames';
import { useEffect, useState } from 'react';

import logo from '/public/assets/logo/Le20_Logo_Cor_1.svg';
import instagram from '/public/assets/icon/instagram.svg';
import whatsapp from '/public/assets/icon/whatsapp.svg';
import simbolo from '/public/assets/logo/isoLe20.png';
import close from '/public/assets/icon/close.svg';
import logoMobile from '/public/assets/logo/Le20_cor-6.svg';







const Menu = () => {


  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);



  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 780) {
        setOpenModal(false);
        setShowMenu(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  const clickMenu = () => {
    setOpenModal(!openModal);
    setShowMenu(!showMenu);
  };



  return (
    <div className={Style.menu}>
      <div className={ClassNames({
        [Style.menuDesk]: true,
      })}>
        <div className={Style.menuDeskContent}>
          <Image src={logo} alt='Logo da Le20' className={Style.logo} />
          <nav className={Style.menuDeskLinks}>
            <ul>
              <li>
                <Link href='/'>
                Le&apos;20
                </Link>
              </li>
              <li>
                <Link href='/parceiros'>
                Nossos Parceiros
                </Link>
              </li>
              <li>
                <Link href='/contatos'>
                Contatos
                </Link>
              </li>
            </ul>
          </nav>
          <div className={Style.menuDeskRedes}>
            <a href='https://www.instagram.com/le20rep/' target='_blank' rel='noreferrer'>
              <Image src={instagram} alt='Instagram icon' className={Style.icon} />
            </a>
            <a href='https://wa.me/5534991278990' target='_blank' rel='noreferrer'>
              <Image src={whatsapp} alt='Whatsapp' className={Style.icon} />
            </a>
          </div>
        </div>

      </div>

      <div className={ClassNames({
        [Style.menuMobile]: true,
      })}>
        {openModal &&
          (<div className={Style.modalBg} onClick={() => clickMenu()} />)
        }

        <button className={Style.btnMenuMobile} onClick={() => clickMenu()} >
          <Image src={simbolo} alt='Simbolo da Le20' className={Style.logo} />
        </button>
        <div className={ClassNames({
          [Style.menuMobileContent]: showMenu,
          [Style.menuMobileOff]: !showMenu,
        })} >
          <button className={Style.btnCloseMenuMobile} onClick={() => clickMenu()}>
            <Image src={close} alt='Fechar menu' />
          </button>
          <Image src={logoMobile} alt='Logo da Le20' className={Style.logoMobile} />
          <nav className={Style.menuMobileLinks}>
            <ul>
              <li>
                <Link href="/">Le&apos;20</Link>
              </li>
              <li>
                <Link href="/parceiros">Nossos Parceiros</Link>
              </li>
              <li>
                <Link href='/contatos'>Contatos</Link>
              </li>
            </ul>
          </nav>
          <div className={Style.menuMobileRedes}>
            <a href='https://www.instagram.com/le20rep/' target='_blank' rel='noreferrer'>
              <Image src={instagram} alt='Instagram icon' className={Style.icon} />
            </a>
            <a href='https://wa.me/5534991278990' target='_blank' rel='noreferrer'>
              <Image src={whatsapp} alt='Whatsapp' className={Style.icon} />
            </a>
          </div>
        </div>

      </div>
    </div>
  )
};

export default Menu;
