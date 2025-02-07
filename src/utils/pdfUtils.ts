"use client";
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/legacy/build/pdf.worker.mjs";
}

interface PdfImageLoader {
  numPages: number;
  getPageImage: (pageNum: number) => Promise<string>;
}

// Função atualizada para converter uma página de cada vez
export async function convertPdfPageToImage(pdfBase64: string): Promise<PdfImageLoader> {
  if (typeof window === 'undefined') {
    throw new Error('Esta função deve ser executada no cliente.');
  }

  const pdfData = atob(pdfBase64);
  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  const pdf: PDFDocumentProxy = await loadingTask.promise;

  const getPageImage = async (pageNum: number): Promise<string> => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Falha ao obter o contexto do canvas.');
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Renderizando a página no canvas
    await page.render({ canvasContext: context, viewport }).promise;

    // Retorna a imagem como base64 (JPEG)
    return canvas.toDataURL('image/jpeg');
  };

  return {
    numPages: pdf.numPages,
    getPageImage,
  };
}
