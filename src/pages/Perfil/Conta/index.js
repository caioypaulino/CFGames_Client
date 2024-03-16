import React, { useEffect, useState } from "react";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import LinhaDadosConta from "../../../components/components_perfil/linhaDadosConta";
import styles from "./Conta.module.css";
import { getToken } from "../../../utils/storage";

const conta = () => {
    const [conta, setConta] = useState({});

    useEffect(() => {
        const token = getToken();

        fetch('http://localhost:8080/perfil/conta', {
            headers: { Authorization: "Bearer " + token }
        }).then(resp => resp.json()).then(json => setConta(json));

        // setCliente(clienteData);
    }, []);

    // utilizando desestruturação
    const { email, senha } = conta;

    return (
        <div className={styles.container}>
            <div className={styles.tbActions}>
                <TabelaActions />
            </div>
            <div className={styles.tbInfo}>
                <LinhaDadosConta tipo="E-mail" dado={email} />
                <LinhaDadosConta tipo="Senha" dado="********" />
            </div>
        </div>
    );
};

export default conta;
