import React, { useEffect, useState } from "react";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import LinhaDadosConta from "../../../components/components_perfil/linhaDadosConta";
import styles from "./Conta.module.css";
import { useNavigate } from "react-router-dom";
import { buscarConta } from "../../../services/clienteService";

const Conta = () => {
    const [conta, setConta] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const carregarConta = async () => {
            const result = await buscarConta(navigate);

            setConta(result);
        }

        carregarConta();
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

export default Conta;
