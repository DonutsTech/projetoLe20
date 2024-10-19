"use client";

// import { IParceiro } from "@/types/parceiro";
import Card from "../Card";
import Style from './GridCard.module.scss';
import { IParceiro } from "@/types/parceiro";


const GridCard = ({parceiros}: {parceiros: Array<IParceiro>}  ) => { 
  

  return (
    <div className={Style.container}>
      {parceiros.map((parceiro, index) => {
        return (
          <Card key={index} 
          nome={parceiro.nome}
          imagens={parceiro.imagens}
          descricao={parceiro.descricao}
          linkSite={parceiro.linkSite}
          catalogo={parceiro.catalogo}
          tips={parceiro.tips}
          />
        )
      })}
    </div>
  )
};

export default GridCard;
