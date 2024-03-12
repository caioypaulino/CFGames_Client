import React, { useEffect, useState } from "react";
import LinhaDados from "../../components/components_perfil/linhaDados";
import TabelaActions from "../../components/components_perfil/tabelaActions";
import styles from "./Perfil.module.css";
import clienteData from "../../utils/cliente.json";
import { getToken } from "../../utils/storage";

const perfil = () => {
  const [cliente, setCliente] = useState({});

  useEffect(() => {
    const token = getToken();

    fetch('http://localhost:8080/perfil/pessoal', {
      headers: { Authorization : "Bearer " + token }
    }).then(resp => resp.json()).then(json => setCliente(json));

    // setCliente(clienteData);
  }, []);

  const getGeneroString = (genero) => {
    return genero === 0 ? "Masculino" : "Feminino";
  };

  return (
    <div className={styles.container}>
      <div className={styles.tbActions}>
        <TabelaActions />
      </div>
      <div className={styles.tbInfo}>
        <div>
          {Object.entries(cliente).map(([tipo, dado], index) => {
            
            return <LinhaDados key={index} tipo={tipo} dado={dado} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default perfil;
