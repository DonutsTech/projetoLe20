'use client';

import Image from 'next/image';
import Style from './Chamada.module.scss';
import logo from '/public/assets/logo/Le20_Logo_Cor_1.svg';



const Chamada = () => {

  return (
    <div className={Style.chamada}>
      <Image src={logo} alt='Logo da Le20' className={Style.logo} />

      <div className={Style.textos}>
        <h2 className={Style.titulo}>
          Bem-vindo à Le&apos;20 Representações!
        </h2>
        <p className={Style.texto}>
          Com mais de 36 anos de experiência no mercado, nossa equipe de profissionais altamente qualificados está pronta para oferecer as melhores soluções em brinquedos, material escolar e de escritório em geral.
        </p>
        <p className={Style.texto}>
          A Le&apos;20 Representações atende com excelência as regiões do Triângulo Mineiro, Alto Paranaíba e Norte de Minas Gerais. Contamos com uma equipe de confiança, que possui profundo conhecimento de mercado e está sempre atualizada com as últimas tendências e necessidades dos nossos clientes.
        </p>

        <ul className={Style.lista}>
          <h3 className={Style.listaTitulo}>Nossos Diferenciais:</h3>
          
          <li className={Style.item}>
            <p className={Style.itemTexto}>
              <span className={Style.destaque}>Experiência e Expertise: </span>
              Décadas de atuação nos permitem entender e antecipar as demandas
              do mercado, oferecendo produtos de alta qualidade e soluções personalizadas.
            </p>
          </li>
          
          <li className={Style.item}>
            <p className={Style.itemTexto}>
              <span className={Style.destaque}>Profissionais de Confiança: </span>
              Nossa equipe é composta por profissionais dedicados e comprometidos com a satisfação do cliente, garantindo um atendimento de excelência.
            </p>
          </li>
          
          <li className={Style.item}>
            <p className={Style.itemTexto}>
              <span className={Style.destaque}>Cobertura Regional: </span>
              Atendemos amplamente as regiões mencionadas, proporcionando um serviço ágil e eficiente.
            </p>
          </li>
        </ul>

      </div>
    </div>
  )
};

export default Chamada;