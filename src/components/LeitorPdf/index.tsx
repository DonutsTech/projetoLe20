"use client";

import React, { useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { convertPdfToImages } from '@/utils/pdfUtils';
import Image from 'next/image';
import styles from './LeitorPdf.module.scss';

interface ILeitorPdfProps {
  file: string;
}

const LeitorPdf = ({ file }: ILeitorPdfProps) => {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSinglePage, setIsSinglePage] = useState(false); // Estado para definir se é uma página ou dupla

  // Função para verificar a largura da tela
  const handleResize = () => {
    if (window.innerWidth < 780) {
      setIsSinglePage(true);
    } else {
      setIsSinglePage(false);
    }
  };

  useEffect(() => {
    // Verificar o tamanho da tela ao carregar
    handleResize();

    // Adicionar um listener para alterações no tamanho da tela
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: file }),
        });
        const data = await response.json();
        if (data.fileContent) {
          const pdfImages = await convertPdfToImages(data.fileContent);
          setPages(pdfImages);
        }
      } catch (error) {
        console.error('Erro ao carregar o PDF:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();
  }, [file]);

  if (loading) {
    return <div className={styles.loading}>Carregando catálogo...</div>;
  }

  return (
    <div className={styles.container}>
      <HTMLFlipBook 
        width={isSinglePage ? 400 : 550} // Ajusta a largura para páginas únicas ou duplas
        height={isSinglePage ? 533 : 733} // Ajusta a altura proporcional
        size="stretch"
        minWidth={300}
        maxWidth={1000}
        minHeight={420}
        maxHeight={1533}
        showCover={true}
        drawShadow={true}
        usePortrait={isSinglePage} // Exibe em modo retrato quando for uma página
        flippingTime={500}
        startPage={0}
        className={styles.book}
      >
        {pages.map((page, index) => (
          <div key={index} className={styles.page}>
            <Image src={page} alt={`Página ${index + 1}`} width={280} height={396} />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default LeitorPdf;
