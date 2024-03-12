import React, { useEffect, useState } from "react";
import LinhaDadosEnderecos from "../../components/components_perfil/linhaDadosEnderecos";
import TabelaActions from "../../components/components_perfil/tabelaActions";
import styles from "./Enderecos.module.css";
import enderecoData from "../../utils/enderecosCliente.json";

const enderecos = () => {
  const [enderecos, setEndereco] = useState({});

  useEffect(() => {
    setEndereco(enderecoData);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.tbActions}>
        <TabelaActions />
      </div>
      <div className={styles.tbInfo}>
        <div>
          {Object.entries(enderecos).map(([tipo, dado], index) => {
            if (tipo === "id") {
              return null; // Pula a renderização para o tipo "id"
            }
            return <LinhaDadosEnderecos key={index} tipo={tipo} dado={dado} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default enderecos;
