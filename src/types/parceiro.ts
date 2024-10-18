// import { StaticImageData } from "next/image";

export interface ICatalogo {
  nome: string,
  catalogo: string,
}

export interface IParceiro {
  'nome': string,
  'imagens': Array<string> | [],
  'descricao': string,
  'linkSite'?: string,
  'catalogo': Array<ICatalogo> | [],
  'tips': Array<string> | [],
}