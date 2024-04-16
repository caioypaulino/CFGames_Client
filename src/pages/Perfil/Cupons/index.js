import React, { useEffect, useState } from "react";
import LinhaDadosCupons from "../../../components/components_perfil/linhaDadosCupons";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import styles from "./Cupons.module.css";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { useNavigate } from "react-router-dom";
import { DateMask } from "../../../utils/mask";

const Cupons = () => {
    const [cupons, setCupons] = useState([]);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [cuponsPorPagina] = useState(4);

    const navigate = useNavigate(); // Usando useNavigate para navegação

    useEffect(() => {
        carregarCupons();
    }, []);

    const carregarCupons = async () => {
        const token = getToken();

        try {
            const response = await fetch('http://localhost:8080/perfil/cupons', {
                headers: { Authorization: "Bearer " + token }
            });

            if (!response.ok) {
                throw new Error('Token Inválido!');
            }

            const cupons = await response.json();

            // Filtrando apenas os cupons disponíveis e com validade após o dia atual
            const cuponsDisponiveis = cupons.filter(cupom => {
                return cupom.disponivel === true && DateMask(cupom.validade) >= new Date();
            });

            // Ordenando os cupons pela maior valor de desconto
            cuponsDisponiveis.sort((cupom1, cupom2) => {
                return cupom2.valorDesconto - cupom1.valorDesconto;
            });

            // Ordenando os cupons pela menor data de validade
            cuponsDisponiveis.sort((cupom1, cupom2) => {
                return DateMask(cupom1.validade) - DateMask(cupom2.validade);
            });


            setCupons(cuponsDisponiveis);
        }
        catch (error) {
            console.error('Erro ao carregar dados:', error);
            Swal.fire({ title: "Erro!", html: `Erro ao carregar cupons.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
        }
    };

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
