import React from "react";
import styles from "./linhaDadosCartoes.module.css";
import Swal from "sweetalert2";
import iconInfo from "../../../assets/buttons/info.svg";
import iconDelete from "../../../assets/buttons/delete.svg";
import { getToken } from "../../../utils/storage";
import { creditCardMask, creditCardXXXXMask } from "../../../utils/mask";

const linhaDadosCartoes = (props) => {
    // Utilizando desestruturação
    const { numeroCartao, nomeCartao, mesVencimento, anoVencimento } = props.dado;

    // Formatando data de vencimento
    const dataVencimento = `${mesVencimento}/${anoVencimento}`;

    // Função para abrir popup de informações
    const abrirPopupInfo = () => {
        Swal.fire({
            title: "Informações do Cartão",
            html: `
                <p><strong>Número do cartão:</strong> ${creditCardMask(numeroCartao)}</p>
                <p><strong>Nome do titular:</strong> ${nomeCartao}</p>
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
                // Chamar função para excluir o cartão
                excluirCartao(numeroCartao);
            }
        });
    };

    // Função para excluir o cartão
    const excluirCartao = async (numeroCartao) => {
        try {
            const token = getToken();

            const response = await fetch("http://localhost:8080/perfil/remove/cartao", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    numeroCartao,
                }),
            });

            if (response.ok) {
                // Exibindo mensagem de sucesso
                Swal.fire({ title: "Removido!", text: "Cartão foi removido com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
                // Recarregar a página ou atualizar os dados, conforme necessário
            }
            else {
                // Buscando mensagem de erro que não é JSON
                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }
        }
        catch (error) {
            // Tratando mensagem de erro
            console.error("Erro ao excluir cartão:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao excluir o cartão.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <p className={styles.infoLabel}>Nome do titular: {nomeCartao}</p>
                <hr className={styles.infoDivider}></hr>
                <p className={styles.infoLabel}>Número do cartão: {creditCardXXXXMask(numeroCartao)}</p>
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