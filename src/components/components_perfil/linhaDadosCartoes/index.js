import React from "react";
import styles from "./linhaDadosCartoes.module.css";
import Swal from "sweetalert2";
import iconInfo from "../../../assets/buttons/info.svg";
import iconDelete from "../../../assets/buttons/delete.svg";
import { creditCardMask, creditCardXXXXMask } from "../../../utils/mask";
import CartaoService, { excluirCartao } from "../../../services/cartaoService";

const linhaDadosCartoes = (props) => {
    // Utilizando desestruturação
    const { numeroCartao, nomeCartao, bandeira, mesVencimento, anoVencimento } = props.dado;

    // Formatando data de vencimento
    const dataVencimento = `${mesVencimento}/${anoVencimento}`;

    // Função para abrir popup de informações
    const abrirPopupInfo = () => {
        Swal.fire({
            title: "Informações do Cartão",
            html: `
                <p><strong>Número do cartão:</strong> ${creditCardMask(numeroCartao)}</p>
                <p><strong>Nome do titular:</strong> ${nomeCartao}</p>
                <p><strong>Bandeira:</strong> ${bandeira}</p>
                <p><strong>Vencimento:</strong> ${dataVencimento}</p>
                <p><strong>CVC:</strong> ***</p>`,
            confirmButtonColor: "#6085FF",
            icon: "info"
        });
    };

    // Função para abrir popup de confirmação de exclusão
    const abrirPopupDelete = () => {
        Swal.fire({
            title: "Tem certeza?",
            text: "Você deseja excluir este cartão?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6085FF",
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                // Chamar função service para excluir o cartão
                CartaoService.excluirCartao(numeroCartao);
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <p className={styles.infoLabel}>{nomeCartao}</p>
                <hr className={styles.infoDivider}></hr>
                <p className={styles.infoLabel}>{bandeira} ({dataVencimento}) {creditCardXXXXMask(numeroCartao)}</p>
                <p className={styles.infoLabel}></p>
            </div>

            <div className={styles.icons}>
                <button className={styles.btnIconInfo} onClick={abrirPopupInfo}>
                    <img className={styles.iconInfo} src={iconInfo} alt="Informações" />
                </button>
                <button className={styles.btnIconDelete} onClick={abrirPopupDelete}>
                    <img className={styles.iconDelete} src={iconDelete} alt="Excluir" />
                </button>
            </div>
        </div>
    );
};

export default linhaDadosCartoes;