"use client";

// import { IParceiro } from "@/types/parceiro";
import Card from "../Card";
import parceiroJson from '@/data/listaParceiros.json';


const GridCard = () => { 
  
  console.log(parceiroJson);

  return (
    <div>
      {parceiroJson.map((parceiro, index) => {
        return (
          <Card key={index} 
          nome={parceiro.nome}
          imagens={parceiro.imagens}
          descricao={parceiro.descricao}
          linkSite={parceiro.linkSite}
          linkCompartilhar={parceiro.linkCompartilhar}
          catalogo={parceiro.catalogo}
          tips={parceiro.tips}

          />
        )
      })}
    </div>
  )
};

export default GridCard;
