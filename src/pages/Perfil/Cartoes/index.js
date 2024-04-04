import React, { useEffect, useState } from "react";
import LinhaDadosCartoes from "../../../components/components_perfil/linhaDadosCartoes";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import iconAdd from "../../../assets/buttons/add.svg"
import styles from "./Cartoes.module.css";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { useNavigate } from "react-router-dom";
import { handleCreditCard, removeMask } from "../../../utils/mask";

const Cartoes = () => {
    const [cartoes, setCartoes] = useState({});

    const navigate = useNavigate(); // Usando useNavigate para navegação

    useEffect(() => {
        const carregarCartoes = async () => {
            const token = getToken();

            try {
                const response = await fetch('http://localhost:8080/perfil/cartoes', {
                    headers: { Authorization: "Bearer " + token }
                });

                if (!response.ok) {
                    throw new Error('Token Inválido!');
                }

                setCartoes(await response.json());
            } 
            catch (error) {
                console.error('Erro ao carregar dados:', error);
                Swal.fire({ title: "Erro!", html: `Erro ao carregar cartões.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
            }
        };

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
                <input id="cvc" type="text" placeholder="CVC" class="swal2-input">`,
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
                adicionarCartao(numeroCartao, nomeCartao, mesVencimento, anoVencimento, cvc);
            },
        });
        
        // adicionando um ouvinte de evento ao campo de numeroCartao para chamar a função handleCreditCard que cria uma máscara dinâmica
        const numeroCartaoInput = document.getElementById('numeroCartao');
        numeroCartaoInput.addEventListener('input', handleCreditCard);
    };

    // função para adicionar um novo cartão
    const adicionarCartao = async (numeroCartao, nomeCartao, mesVencimento, anoVencimento, cvc) => {
        try {
            const token = getToken();
            const response = await fetch("http://localhost:8080/perfil/add/cartao", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    numeroCartao,
                    nomeCartao,
                    mesVencimento,
                    anoVencimento,
                    cvc,
                }),
            });

            if (response.ok) {
                Swal.fire({ title: "Sucesso!", text: "Cartão adicionado com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            }
            else {
                // buscando mensagem de erro que não é JSON
                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }
        }
        catch (error) {
            // tratando mensagem de erro
            console.error("Erro ao adicionar cartão:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar o cartão.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.tbActions}>
                <TabelaActions />
            </div>
            <div className={styles.tbInfo}>
                {Object.entries(cartoes).map(([tipo, dado], index) => (
                    <LinhaDadosCartoes key={index} index={index + 1} tipo={tipo} dado={dado} />
                ))}
                <div className={styles.btnIconAdd}>
                    <button className={styles.btnIcon} onClick={abrirPopupAdd}>
                        <img className={styles.iconAdd} src={iconAdd} alt="Adicionar" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cartoes;
