// Resumo.js
import React from "react";
import style from "./ResumoCarrinho.module.css";
import { valueMaskBR } from "../../../utils/mask";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { useNavigate } from "react-router-dom";
import CarrinhoService from "../../../services/carrinhoService";

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
                CarrinhoService.excluirCarrinho();
            }
        });
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