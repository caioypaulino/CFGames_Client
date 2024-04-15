import React, { useEffect, useState } from "react";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import TabelaPerfilSolicitacoes from "../../../components/components_perfil/tabelaPerfilSolicitacoes";
import styles from "./SolicitacoesTrocaDevolucao.module.css";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { useNavigate } from "react-router-dom";

const SolicitacoesTrocaDevolucao = () => {
    const [solicitacoes, setSolicitacoes] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        carregarSolicitacoes();
    }, []); 

    const carregarSolicitacoes = async () => {
        const token = getToken();

        try {
            const response = await fetch('http://localhost:8080/perfil/solicitacoestroca', {
                headers: { Authorization: "Bearer " + token }
            });

            if (response.ok) {
                const json = await response.json()
                const sortedSolicitacoes = json.sort((a, b) => a.id - b.id); // Ordena os pedidos por ID

                setSolicitacoes(sortedSolicitacoes);
            }
            else {
                if (response.status === 500) {
                    throw new Error('Token Inválido!');
                }
                else if (response.status === 400) {
                    Swal.fire({ title: "Erro!", html: `Erro ao carregar solicitações de troca/devolução!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
                }
            }
        } 
        catch (error) {
            console.error('Erro ao carregar dados:', error);
            Swal.fire({ title: "Erro!", html: `Erro ao carregar solicitações de troca/devolução.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.tbActions}>
                <TabelaActions />
            </div>
            <div className={styles.tbInfo}>
                <TabelaPerfilSolicitacoes solicitacoes={solicitacoes} />
            </div>
        </div>
    );
};

export default SolicitacoesTrocaDevolucao;
