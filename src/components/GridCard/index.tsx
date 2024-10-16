"use client";

// import { IParceiro } from "@/types/parceiro";
import Card from "../Card";
import parceiroJson from '@/data/listaParceiros.json';


const GridCard = () => { 
  

  return (
    <div>
      {parceiroJson.map((parceiro, index) => {
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
