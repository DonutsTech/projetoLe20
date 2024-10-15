"use client";

// import { useEffect, useState } from "react";
import Style from './LeitorPdf.module.scss';

interface ILeitorPdfProps {
  file: string;
}

const LeitorPdf = ({ file }: ILeitorPdfProps) => {
  // const [numPages, setNumPages] = useState<number | null>(null);
  // const [pageNumber, setPageNumber] = useState(1);

  return (
    <div className={Style.container}>
      <p>Bora Codar!{file}</p>
    </div>
  );
};

export default LeitorPdf;
