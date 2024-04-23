import React, { useEffect, useState } from "react";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import LinhaDadosConta from "../../../components/components_perfil/linhaDadosConta";
import styles from "./Conta.module.css";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { useNavigate } from "react-router-dom";

const conta = () => {
    const [conta, setConta] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        carregarConta();
    }, []);

    const carregarConta = async () => {
        const token = getToken();

        try {
            const response = await fetch('http://localhost:8080/perfil/conta', {
                headers: { Authorization: "Bearer " + token }
            });

            if (!response.ok) {
                throw new Error('Token Inválido!');
            }

            setConta(await response.json());
        }
        catch (error) {
            console.error('Erro ao carregar dados:', error);
            Swal.fire({ title: "Erro!", html: `Erro ao carregar dados da conta.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
        }
    };

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
