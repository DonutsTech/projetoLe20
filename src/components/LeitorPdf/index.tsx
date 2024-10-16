"use client";

import Style from './LeitorPdf.module.scss'; // Estilos do componente


interface ILeitorPdfProps {
  file: string; // Caminho do PDF
}

const LeitorPdf = ({ file }: ILeitorPdfProps) => {

  return (
    <div className={Style.container}>
      <object data={file} type="application/pdf" width="100%" height="100%" />
    </div>
  );
};

export default LeitorPdf;
