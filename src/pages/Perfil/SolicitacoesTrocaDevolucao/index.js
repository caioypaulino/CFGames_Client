import React, { useEffect, useState } from "react";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import TabelaPerfilSolicitacoes from "../../../components/components_perfil/tabelaPerfilSolicitacoes";
import styles from "./SolicitacoesTrocaDevolucao.module.css";
import { useNavigate } from "react-router-dom";
import SolicitacaoService from "../../../services/solicitacaoService";

const SolicitacoesTrocaDevolucao = () => {
    const [solicitacoes, setSolicitacoes] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const carregarSolicitacoes = async () => {
            const response = await SolicitacaoService.buscarSolicitacoes(navigate);
            
            setSolicitacoes(response);
        }

        carregarSolicitacoes();
    }, []); 

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
