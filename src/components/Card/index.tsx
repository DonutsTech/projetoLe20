'use client';

import Slide from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import Style from './Card.module.scss';
import site from '/public/assets/icon/btn_site.png';
import pdf from '/public/assets/icon/btn_catalogo.png';
import compartilhar from '/public/assets/icon/btn_compartilhar.png';
import close from '/public/assets/icon/close.svg';

import { useState } from 'react';
import Image from 'next/image';
import { IParceiro } from '@/types/parceiro';


const Card = ({ nome, imagens, descricao, linkSite, linkCompartilhar, catalogo, tips }: IParceiro) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);


  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    initialSlide: currentSlide,
    afterChange: (current: number) => setCurrentSlide(current),
  };


  return (
    <div className={Style.container}>
      <div className={Style.card} onClick={() => {
        setModalOpen(true)
        setContentOpen(true)
      }}>
        <div className={Style.overlay} />
        <h3 className={Style.titulo}>{nome}</h3>
        <div className={Style.botoes}>
          <a href={linkSite} target='_blank' rel='noreferrer' title={`Site || ${nome}`}>
            <Image src={site} alt="Site" className={Style.btn} />
          </a>
          <a href={catalogo} target='_blank' rel='noreferrer'>
            <Image src={pdf} alt="Catalogo" className={Style.btn} />
          </a>
          <a href={linkCompartilhar} target='_blank' rel='noreferrer'>
            <Image src={compartilhar} alt="Compartilhar" className={Style.btn} />
          </a>
        </div>
        <div className={Style.slide}>
          <Slide {...settings} className={Style.boxSlide} draggable={false}>
            {imagens.map((img, index) =>
              <div key={index}>
                <Image src={img} width={280} height={280} alt="Slide" className={Style.imageSlide} />
              </div>
            )}
          </Slide>
        </div>
      </div>
      {contentOpen && (
        <div className={Style.contentBox}>
          <div className={Style.content}>
            <button className={Style.btnClose} onClick={() => {
              setModalOpen(false)
              setContentOpen(false)
            }}>
              <Image src={close} alt="Fechar" />
            </button>
            <div className={Style.cabeca}>

              <h3 className={Style.titulo}>{nome}</h3>
              <div className={Style.tips}>
                {tips.map((tip, index) => {
                  return (
                    <span key={index} className={Style.tip}>{tip}</span>
                  )
                })}
              </div>
            </div>
            <div className={Style.body}>

              <div className={Style.slide}>
                <Slide {...settings} className={Style.boxSlide} draggable={false}>
                  {imagens.map((img, index) =>
                    <div key={index}>
                      <Image src={img} width={280} height={280} alt="Slide" className={Style.imageSlide} />
                    </div>
                  )}
                </Slide>
              </div>
              <div className={Style.textos}>
                <p className={Style.descricao}>{descricao}</p>

                <div className={Style.botoes}>
                  <a href={linkSite} target='_blank' rel='noreferrer' title={`Site || ${nome}`}>
                    <Image src={site} alt="Site" className={Style.btn} />
                  </a>
                  <a href={catalogo} target='_blank' rel='noreferrer'>
                    <Image src={pdf} alt="Catalogo" className={Style.btn} />
                  </a>
                  <a href={linkCompartilhar} target='_blank' rel='noreferrer'>
                    <Image src={compartilhar} alt="Compartilhar" className={Style.btn} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {modalOpen &&
        <div className={Style.modal} onClick={() => {
          setModalOpen(false)
          setContentOpen(false)
        }} />
      }
    </div>
  );
};

export default Card;