// Resumo.js
import React from "react";
import style from "./ResumoCarrinho.module.css";
import { valueMaskBR } from "../../../utils/mask";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { useNavigate } from "react-router-dom";

const ResumoCarrinho = (props) => {
    const navigate = useNavigate();

    // Função para abrir popup de confirmação de exclusão
    const abrirPopupDelete = () => {
        Swal.fire({
            title: "Tem certeza?",
            text: "Você deseja excluir este carrinho?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6085FF",
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                // Chamar função para excluir o cartão
                excluirCarrinho();
            }
        });
    };

    // Função para excluir o cartão
    const excluirCarrinho = async () => {
        try {
            const token = getToken();

            const response = await fetch("http://localhost:8080/carrinhodecompra/delete", {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token,
                }
            });

            if (response.ok) {
                // Exibindo mensagem de sucesso
                Swal.fire({ title: "Removido!", text: "Carrinho de Compras removido com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
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
            console.error("Erro ao excluir carrinho:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao excluir o Carrinho de Compras.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
        }
    };

    return (
        <>
            <div className={style.resumo}>
                <h1>Resumo</h1>
                <p>Total: R${valueMaskBR(props.valorCarrinho)}</p>
                <button className={style.btn}><a className={style.link} href="/checkout">Finalizar Pedido</a></button>
                <button className={style.btnContinuar}><a className={style.link} href="/">Continuar Comprando</a></button>
                <button className={style.btnExcluir} onClick={abrirPopupDelete}>Excluir Carrinho</button>
            </div>
        </>
    );
};

export default ResumoCarrinho;