import React from "react";
import styles from "./tabelaActions.module.css";
import { Link } from "react-router-dom";

const tabelaActions = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.titleContainer}>Dados da conta</h1>
      </div>
      <div className={styles.containerButtons}>
        <Link to="/perfil/pessoal"><button>Meus dados</button></Link>
        <Link to="/perfil/enderecos"><button>Endereços </button></Link>
        <button>Cartões de crédito</button>
        <button>Meus pedidos</button>
      </div>
    </div>
  );
};

export default tabelaActions;
