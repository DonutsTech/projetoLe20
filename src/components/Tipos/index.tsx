import classNames from 'classnames';
import Style from './Tipos.module.scss';

const tipos: string[] = ['Papelarias', 'Brinquedos', 'Pedagógicos', 'Papelaria Fofa', 'Festas', 'Presentes', 'Puericulturas', 'Licenças']

interface Props {
  tipoSelecionado: string | null;
  selecionouTipo: (nome: string | null) => void;
}

const Tipos = ({tipoSelecionado, selecionouTipo}: Props) => {
  return (
    <div className={Style.tipos}>
      {
        tipos.map((nome, index) => (
          <button className={classNames({
            [Style['todos']]: true,
            [Style['selecionado']]: tipoSelecionado === nome,
            [Style['nao-selecionado']]: (tipoSelecionado !== null && tipoSelecionado !== nome),
          })} key={index} type='button' onClick={() => selecionouTipo(nome)}>
            {nome}
          </button>
        ))
      }
      <button className={Style.resetBtn} type='button' onClick={() => selecionouTipo(null)}>Todos</button>
    </div>
  )
}

export default Tipos;
