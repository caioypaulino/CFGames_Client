import React, { useEffect, useState } from "react";
import LinhaDadosCartoes from "../../../components/components_perfil/linhaDadosCartoes";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import iconAdd from "../../../assets/buttons/add.svg"
import styles from "./Cartoes.module.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { handleCreditCard, handleNumber, removeMask } from "../../../utils/mask";
import CartaoService from "../../../services/cartaoService";

const Cartoes = () => {
    const [cartoes, setCartoes] = useState([]);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [cartoesPorPagina] = useState(5);

    const navigate = useNavigate();

    useEffect(() => {
        const carregarCartoes = async () => {
            const response = await CartaoService.buscarCartoes(navigate);

            setCartoes(response);
        }

        carregarCartoes();
    }, []);

    // função para abrir o formulário de adição de cartão
    const abrirPopupAdd = () => {
        Swal.fire({
            title: "Adicionar Novo Cartão",
            html: `
                <input id="numeroCartao" type="text" placeholder="Número do Cartão" inputmode="numeric" maxlength="19" class="swal2-input">
                <input id="nomeCartao" type="text" placeholder="Nome do Titular" class="swal2-input">
                <input id="mesVencimento" type="number" placeholder="Mês de Vencimento" max="12" class="swal2-input">
                <input id="anoVencimento" type="number" placeholder="Ano de Vencimento" min="2024" class="swal2-input">
                <input id="cvc" type="text" placeholder="CVC" inputmode="numeric" maxlength="4" class="swal2-input">`,
            showCancelButton: true,
            confirmButtonText: "Adicionar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                const numeroCartao = removeMask(Swal.getPopup().querySelector("#numeroCartao").value); // remove espaços em branco da máscara
                const nomeCartao = Swal.getPopup().querySelector("#nomeCartao").value;
                const mesVencimento = Swal.getPopup().querySelector("#mesVencimento").value;
                const anoVencimento = Swal.getPopup().querySelector("#anoVencimento").value;
                const cvc = Swal.getPopup().querySelector("#cvc").value;

                CartaoService.adicionarCartao(numeroCartao, nomeCartao, mesVencimento, anoVencimento, cvc);
            },
        });

        // adicionando um ouvinte de evento ao campo de numeroCartao para chamar a função handleCreditCard que cria uma máscara dinâmica
        const numeroCartaoInput = document.getElementById('numeroCartao');
        const cvcInput = document.getElementById('cvc');
        numeroCartaoInput.addEventListener('input', handleCreditCard);
        cvcInput.addEventListener('input', handleNumber);
    };

    const indexUltimoCartao = paginaAtual * cartoesPorPagina;
    const indexPrimeiroCartao = indexUltimoCartao - cartoesPorPagina;

    const cartoesAtuais = cartoes.slice(indexPrimeiroCartao, indexUltimoCartao);
    const totalPaginas = Math.ceil(cartoes.length / cartoesPorPagina);

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
                    {Object.entries(cartoesAtuais).map(([tipo, dado], index) => (
                        <LinhaDadosCartoes key={index} index={index + 1} tipo={tipo} dado={dado} />
                    ))}

                </div>
            </div>
            <div className={styles.pagination}>
                <button onClick={handlePaginaAnterior} disabled={paginaAtual === 1}>&lt;</button>
                <span className={styles.paginaAtual}>{paginaAtual}</span><span className={styles.totalPaginas}>/{totalPaginas}</span>
                <button onClick={handleProximaPagina} disabled={paginaAtual === totalPaginas}>&gt;</button>
            </div>
            <div className={styles.btnIconAdd}>
                <button className={styles.btnIcon} onClick={abrirPopupAdd}>
                    <img testid="iconAdd" className={styles.iconAdd} src={iconAdd} alt="Adicionar" />
                </button>
            </div>
        </div>
    );
};

export default Cartoes;
