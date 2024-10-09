import Contato from "@/components/Contato";
import Perfil from "@/components/Perfil";
import Style from "./Contatos.module.scss";


export default function Contatos() {

  return (
    <div className={Style.page}>
      <Perfil />
      <Contato />
    </div>
  )
}