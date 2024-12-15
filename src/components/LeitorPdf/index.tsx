"use client";

import React, { useState, useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { convertPdfPageToImage } from '@/utils/pdfUtils';
import Image from 'next/image';
import styles from './LeitorPdf.module.scss';
import logo from '/public/assets/logo/isoLe20.png';
//import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import axios from 'axios';

interface ILeitorPdfProps {
  file: string;
  contPag: number;
}

/*
const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: `${process.env.ACCESS_kEY_ID}`,
    secretAccessKey: `${process.env.SECRET_ACCESS_kEY}`,
  },
});
*/

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

  /*
  const streamToArrayBuffer = async (stream: ReadableStream): Promise<ArrayBuffer> => {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    // Concatena todos os chunks em um único ArrayBuffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;

    chunks.forEach((chunk) => {
      result.set(chunk, offset);
      offset += chunk.length;
    });

    return result.buffer;
  };
  */

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoading(true);

        const response = await axios.get(file, {
          responseType: 'arraybuffer',
          headers: {
              'Content-Type': 'application/pdf',
          },
        });

        console.log('Resposta recebida do S3:', response.status); // Adicionando log

        // Convertendo o arquivo PDF em base64
        const base64 = Buffer.from(response.data).toString('base64');
        /*
        const nome = file.substring(file.lastIndexOf('/') + 1)

        const command = new GetObjectCommand({ Bucket: 'le20catalogos', Key: nome });

        const response = await s3.send(command);

        console.log(response)

        if (!response.Body) {
          throw new Error('O arquivo não foi encontrado ou está vazio.');
        }

        const arrayBuffer = await streamToArrayBuffer(response.Body as ReadableStream);

        const base64 = Buffer.from(new Uint8Array(arrayBuffer)).toString('base64');

        console.log(base64)
        */

        // Verifica se o conteúdo do PDF foi retornado
        if (base64) {
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
