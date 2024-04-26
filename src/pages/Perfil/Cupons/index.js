import React, { useEffect, useState } from "react";
import LinhaDadosCupons from "../../../components/components_perfil/linhaDadosCupons";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import styles from "./Cupons.module.css";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { useNavigate } from "react-router-dom";
import { DateMask } from "../../../utils/mask";
import { buscarCupons } from "../../../services/cupomService";

const Cupons = () => {
    const [cupons, setCupons] = useState([]);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [cuponsPorPagina] = useState(4);

    const navigate = useNavigate(); // Usando useNavigate para navegação

    useEffect(() => {
        const carregarCupons = async () => {
            const result = await buscarCupons(navigate);

            setCupons(result);
        }

        carregarCupons();
    }, []);

    const indexUltimoCupom = paginaAtual * cuponsPorPagina;
    const indexPrimeiroCupom = indexUltimoCupom - cuponsPorPagina;

    const cuponsAtuais = cupons.slice(indexPrimeiroCupom, indexUltimoCupom);
    const totalPaginas = Math.ceil(cupons.length / cuponsPorPagina);

    const handlePaginaAnterior = () => {
        setPaginaAtual(paginaAnterior => Math.max(paginaAnterior - 1, 1));
    };

    const handleProximaPagina = () => {
        setPaginaAtual(paginaAnterior => Math.min(paginaAnterior + 1, totalPaginas));
    };

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.tbActions}>
                    <TabelaActions />
                </div>
                <div className={styles.tbInfo}>
                    {Object.entries(cuponsAtuais).map(([tipo, cupom]) => (
                        <LinhaDadosCupons cupom={cupom} />
                    ))}
                </div>
            </div>
            <div className={styles.pagination}>
                <button onClick={handlePaginaAnterior} disabled={paginaAtual === 1}>&lt;</button>
                <span className={styles.paginaAtual}>{paginaAtual}</span><span className={styles.totalPaginas}>/{totalPaginas}</span>
                <button onClick={handleProximaPagina} disabled={paginaAtual === totalPaginas}>&gt;</button>
            </div>
        </div>
    );
};

export default Cupons;
