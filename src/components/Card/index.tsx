'use client';

import Slide from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import Style from './Card.module.scss';
import site from '/public/assets/icon/btn_site.png';
import pdf from '/public/assets/icon/btn_catalogo.png';
import close from '/public/assets/icon/close.svg';
import down from '/public/assets/icon/download_icon.svg';
import share from '/public/assets/icon/compartilha_icon.svg';

import { useState } from 'react';
import Image from 'next/image';
import { IParceiro } from '@/types/parceiro';
import classNames from 'classnames';
import LeitorPdf from '../LeitorPdf';


const Card = ({ nome, imagens, descricao, linkSite, catalogo, tips }: IParceiro) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const [catalogosOpen, setCatalogosOpen] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<string | null>(null);
  const [modalCatalog, setModalCatalog] = useState(false);
  const [nomeSelecionado, setNomeSelecionado] = useState<string>('');
  const [contPag, setContPag] = useState<number>(11);

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

  const handleOpenCatalog = (catalogFile: string) => {
    setSelectedCatalog(catalogFile);
    setModalCatalog(true);
  }


  return (
    <div className={Style.container}>
      <div className={Style.card} onClick={() => {
        setModalOpen(true)
        setContentOpen(true)
      }}>
        <div className={Style.overlay} />
        <h3 className={Style.titulo}>{nome}</h3>
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
              setCatalogosOpen(false);
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
                  <div className={Style.catalogos} onClick={() => { setCatalogosOpen(!catalogosOpen) }}>
                    <Image src={pdf} alt="Catalogo" className={Style.btn} />
                    <div className={classNames({
                      [Style.overlay]: catalogosOpen,
                      [Style.off]: !catalogosOpen,
                    })}>
                      {catalogo.map((item, index) =>
                        <span key={index}
                          className={Style.catalogosItem}
                          onClick={() => { 
                            handleOpenCatalog(item.catalogo); 
                            setNomeSelecionado(item.nome); 
                            setContPag(item.contPag || 11);
                          }}
                        > {item.nome}
                        </span>)}
                    </div>

                  </div>
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
          setSelectedCatalog(null)
          setModalCatalog(false)
        }} />
      }
      {selectedCatalog && modalCatalog && (
        <div className={Style.modalCatalog}>
          <button className={Style.btnClose} onClick={() => {
            setModalCatalog(false)
            setSelectedCatalog(null)
          }}>
            <Image src={close} alt="Fechar" />
          </button>
          <LeitorPdf file={selectedCatalog} contPag={contPag} />
          <div className={Style.btnBox}>
            <button
              onClick={() => {
                window.open(selectedCatalog, '_blank', 'noopener,noreferrer');
              }}
            >
              <Image src={down} alt='Download' />
            </button>
            <button
              onClick={() => {
                const shareMessage = `Olá, veja o ${nomeSelecionado} da empresa ${nome},\n\n` +
                  `Clique no link a baixo e faça o download do catálogo \n\n` +
                  `${selectedCatalog} \n\n` +
                  `Não perca tempo, entre em contato e solicite o seu orçamento!\n` +
                  `(34) 99127-8990\n\n` +
                  `Saiba mais no site: https://le20rep.com/`;

                const zapShare = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;

                window.open(zapShare, '_blank', 'noopener,noreferrer');
              }}
            >
              <Image src={share} alt='Compartilhar' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;