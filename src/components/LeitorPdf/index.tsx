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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      setLoading(true);
      setError(null); // Reseta o erro antes de tentar buscar novamente

      try {
        const response = await fetch('/api/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: file }),
        });

        if (!response.ok) {
          throw new Error('Erro ao fazer o download do arquivo PDF.');
        }

        const data = await response.json();

        if (data.fileContent) {
          const pdfImages = await convertPdfToImages(data.fileContent);
          setPages(pdfImages);
        } else {
          throw new Error('O conteúdo do arquivo PDF não foi encontrado.');
        }
      } catch (error) {
        console.error('Erro ao carregar o PDF:', error);
        setError('Ocorreu um erro ao carregar o catálogo.');
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();
  }, [file]);

  if (loading) {
    return <div className={styles.loading}>Carregando catálogo...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <HTMLFlipBook 
        width={550} 
        height={733} 
        size="stretch" 
        minWidth={300} 
        maxWidth={1000} 
        minHeight={420} 
        maxHeight={1533}
        showCover={true}
        drawShadow={true}
        usePortrait={false}
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
