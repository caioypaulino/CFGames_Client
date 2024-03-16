import React from "react";
import styles from "./tabelaActions.module.css";
import { Link } from "react-router-dom";

const tabelaActions = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.titleContainer}>Perfil</h1>
      </div>
      <div className={styles.containerButtons}>
        <Link to="/perfil/conta"><button>Dados da conta</button></Link>
        <Link to="/perfil/pessoal"><button>Dados pessoais</button></Link>
        <Link to="/perfil/enderecos"><button>Endereços </button></Link>
        <Link to="/perfil/cartoes"><button>Cartões de crédito</button></Link>
        <button>Meus pedidos</button>
        <button>Meus Cupons</button>
        <button>Trocas e Devoluções</button>
      </div>
    </div>
  );
};

export default tabelaActions;
