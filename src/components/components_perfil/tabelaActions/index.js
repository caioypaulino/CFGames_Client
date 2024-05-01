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
                <Link to="/perfil/conta"><button>Dados da Conta</button></Link>
                <Link to="/perfil/pessoal"><button>Dados Pessoais</button></Link>
                <Link to="/perfil/enderecos"><button>Endereços </button></Link>
                <Link to="/perfil/cartoes"><button>Cartões de Crédito</button></Link>
                <Link to="/perfil/cupons"><button>Meus Cupons</button></Link>
                <Link to="/perfil/pedidos"><button>Meus Pedidos</button></Link>
                <Link to="/perfil/solicitacoes_troca_devolucao"><button>Trocas e Devoluções</button></Link>
            </div>
        </div>
    );
};

export default tabelaActions;
