"use client";
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/legacy/build/pdf.worker.mjs";
}

export async function convertPdfToImages(pdfBase64: string): Promise<string[]> {
  if (typeof window === 'undefined') {
    throw new Error('Esta função deve ser executada no cliente.');
  }

  const pdfData = atob(pdfBase64);
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

      await page.render({ canvasContext: context, viewport }).promise;
      images.push(canvas.toDataURL('image/jpeg'));
    }
  }

  return images;
};
