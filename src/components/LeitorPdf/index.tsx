"use client";

import React, { useState, useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { convertPdfPageToImage } from '@/utils/pdfUtils';
import Image from 'next/image';
import styles from './LeitorPdf.module.scss';
import logo from '/public/assets/logo/isoLe20.png';

interface ILeitorPdfProps {
  file: string;
  contPag: number;
}

const LeitorPdf = ({ file, contPag = 11 }: ILeitorPdfProps) => {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(0);
  const [isSinglePage, setIsSinglePage] = useState(false);
  const flipBookRef = useRef<HTMLFlipBook>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);

  const handleResize = () => {
    setIsSinglePage(window.innerWidth < 780);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPdfFromS3 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);

      // Verifica se a requisição foi bem-sucedida
      if (!response.ok) {
        throw new Error(`Erro ao buscar o PDF: ${response.statusText}`);
      }

      // Obtém os dados como um Blob
      const blob = await response.blob();

      // Converte o Blob em Base64
      const base64 = await blobToBase64(blob);

      return base64;
    } catch (error) {
      console.error('Erro ao buscar o PDF do S3:', error);
      throw error;
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoading(true);

        // Baixa o PDF do S3 e converte para Base64
        const base64 = await fetchPdfFromS3(file);

        // Verifica se o conteúdo do PDF foi retornado
        if (base64 || base64 === 'data:application/pdf;base64,') {
          setPdfBase64(base64);
          const { numPages, getPageImage } = await convertPdfPageToImage(base64);

          // Verifica se o número de páginas é válido
          if (numPages <= 0) {
            throw new Error('O PDF não contém páginas.');
          }

          setNumPages(numPages);

          const initialPages = await Promise.all(
            Array.from({ length: (contPag > 11 ? 11 : contPag) }, (_, index) => getPageImage(index + 1))
          );

          setPages(initialPages);

          const loadRemainingPages = async () => {
            for (let i = 11; i < numPages; i++) {
              try {
                const pageImage = await getPageImage(i + 1);
                setPages((prev) => {
                  const newPages = [...prev];
                  newPages[i] = pageImage;
                  return newPages;
                });
              } catch (error) {
                console.error(`Erro ao carregar a página ${i + 1}:`, error);
              }
            }
          };

          loadRemainingPages();
        } else {
          throw new Error('Conteúdo do PDF não disponível.');
        }
      } catch (error) {
        console.error('Erro ao carregar o PDF:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();
  }, [file]);

  const handlePageFlip = async (pageIndex: number) => {
    if (!pages[pageIndex] && pageIndex < numPages && pdfBase64) {
      try {
        const { getPageImage } = await convertPdfPageToImage(pdfBase64);
        const pageImage = await getPageImage(pageIndex + 1);
        setPages((prev) => {
          const newPages = [...prev];
          newPages[pageIndex] = pageImage;
          return newPages;
        });
      } catch (error) {
        console.error(`Erro ao carregar a imagem da página ${pageIndex + 1}:`, error);
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Image src={logo} alt="Logo" width={100} height={100} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <HTMLFlipBook
        ref={flipBookRef}
        width={isSinglePage ? 400 : 550}
        height={isSinglePage ? 533 : 733}
        size="stretch"
        minWidth={300}
        maxWidth={1000}
        minHeight={420}
        maxHeight={1533}
        showCover={true}
        drawShadow={true}
        usePortrait={isSinglePage}
        flippingTime={500}
        startPage={0}
        className={styles.book}
        onFlip={(e) => handlePageFlip(e.data)}
      >
        {Array.from({ length: numPages }, (_, index) => (
          <div key={index} className={styles.page}>
            {pages[index] ? (
              <Image src={pages[index]} alt={`Página ${index + 1}`} width={280} height={396} />
            ) : (
              <div>Carregando...</div>
            )}
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default LeitorPdf;
