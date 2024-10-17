"use client";
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

// pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.worker.mjs";
// pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/legacy/build/pdf.worker.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/legacy/build/pdf.worker.min.mjs";

export async function convertPdfToImages(pdfBase64: string): Promise<string[]> {
  // Garantir que o código seja executado apenas no ambiente do cliente
  if (typeof window === 'undefined') {
    throw new Error('Esta função deve ser executada no ambiente do cliente.');
  }

  try {
    const pdfData = atob(pdfBase64); // Decodificar o base64 para binário
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf: PDFDocumentProxy = await loadingTask.promise;
    const numPages = pdf.numPages;
    const images: string[] = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Renderiza a página no canvas
        await page.render({ canvasContext: context, viewport }).promise;
        images.push(canvas.toDataURL('image/jpeg')); // Adiciona a imagem como dataURL
      }
    }

    return images;
  } catch (error) {
    console.error('Erro ao converter PDF em imagens:', error);
    throw error;
  }
}
