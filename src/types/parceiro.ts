// import { StaticImageData } from "next/image";

export interface IParceiro {
  'nome': string,
  'imagens': Array<string> | [],
  'descricao': string,
  'linkSite'?: string,
  'linkCompartilhar'?: string,
  'catalogo': Array<string> | [],
  'tips': Array<string> | [],
}