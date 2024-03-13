import React, { useEffect, useState } from "react";
import LinhaDadosEnderecos from "../../../components/components_perfil/linhaDadosEnderecos";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import styles from "./Enderecos.module.css";
import { getToken } from "../../../utils/storage";

const enderecos = () => {
  const [enderecos, setEnderecos] = useState({});

  useEffect(() => {
    const token = getToken();

    fetch('http://localhost:8080/perfil/enderecos', {
      headers: { Authorization : "Bearer " + token }
    }).then(resp => resp.json()).then(json => setEnderecos(json));
      
    // setCliente(clienteData);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.tbActions}>
        <TabelaActions />
      </div>
      <div className={styles.tbInfo}>
        <div>
          {Object.entries(enderecos).map(([tipo, dado], index) => {
            
            return <LinhaDadosEnderecos key={index} index={index + 1} tipo={tipo} dado={dado} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default enderecos;
