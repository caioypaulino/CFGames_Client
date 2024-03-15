import React, { useEffect, useState } from "react";
import LinhaDadosEnderecos from "../../../components/components_perfil/linhaDadosEnderecos";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import iconAdd from "../../../assets/buttons/add.svg"
import styles from "./Cartoes.module.css";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { handleCep, cepMask } from '../../../utils/mask';

const cartoes = () => {
    const [cartoes, setCartoes] = useState({});

    useEffect(() => {
        const token = getToken();

        fetch('http://localhost:8080/perfil/cartoes', {
            headers: { Authorization: "Bearer " + token }
        }).then(resp => resp.json()).then(json => setCartoes(json));
    }, []);

    // função para abrir o formulário de adição de endereço
    const abrirPopupAdd = () => {
        Swal.fire({
            title: "Adicionar Novo Endereço",
            html: `
                <input id="numero" type="text" placeholder="Número" class="swal2-input">
                <input id="complemento" type="text" placeholder="Complemento" class="swal2-input">
                <input id="tipo" type="text" placeholder="Tipo" class="swal2-input">
                <input id="cep" type="text" placeholder="CEP" maxlength="9" class="swal2-input">
                <input id="observacao" type="text" placeholder="Observação" class="swal2-input">`,
            showCancelButton: true,
            confirmButtonText: "Adicionar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                const numero = Swal.getPopup().querySelector("#numero").value;
                const complemento = Swal.getPopup().querySelector("#complemento").value;
                const tipo = Swal.getPopup().querySelector("#tipo").value;
                const cep = cepMask(Swal.getPopup().querySelector("#cep").value);
                const observacao = Swal.getPopup().querySelector("#observacao").value;
                adicionarEndereco(numero, complemento, tipo, cep, observacao);
            },
        });

        // adicionando um ouvinte de evento ao campo de CEP para chamar a função handleZipCode
        const cepInput = document.getElementById('cep');
        cepInput.addEventListener('input', handleCep);
    };

    // função para adicionar um novo endereço
    const adicionarEndereco = async (numero, complemento, tipo, cep, observacao) => {
        try {
            const token = getToken();
            const response = await fetch("http://localhost:8080/perfil/add/endereco", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    numero,
                    complemento,
                    tipo,
                    endereco: {
                        cep,
                    },
                    observacao,
                }),
            });

            if (response.ok) {
                Swal.fire({ title: "Sucesso!", text: "Endereço adicionado com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            }
            else {
                // buscando mensagem de erro que não é JSON
                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }
        }
        catch (error) {
            // tratando mensagem de erro
            console.error("Erro ao adicionar endereço:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar o endereço.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.tbActions}>
                <TabelaActions />
            </div>
            <div className={styles.tbInfo}>
                {Object.entries(cartoes).map(([tipo, dado], index) => (
                    <LinhaDadosEnderecos key={index} index={index + 1} tipo={tipo} dado={dado} />
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

export default cartoes;
