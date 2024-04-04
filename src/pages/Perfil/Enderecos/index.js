import React, { useEffect, useState } from "react";
import LinhaDadosEnderecos from "../../../components/components_perfil/linhaDadosEnderecos";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import iconAdd from "../../../assets/buttons/add.svg"
import styles from "./Enderecos.module.css";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { handleCep, cepMask, handleNumber } from '../../../utils/mask';
import { useNavigate } from "react-router-dom";

const Enderecos = () => {
    const [enderecos, setEnderecos] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const carregarEnderecos = async () => {
            const token = getToken();

            try {
                const response = await fetch('http://localhost:8080/perfil/enderecos', {
                    headers: { Authorization: "Bearer " + token }
                });
                
                if (!response.ok) {
                    throw new Error('Token Inválido!');
                }

                setEnderecos(await response.json());
            } 
            catch (error) {
                console.error('Erro ao carregar dados:', error);
                Swal.fire({ title: "Erro!", html: `Erro ao carregar endereços.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => {  navigate("/login"); });
            }
        };

        carregarEnderecos();
    }, []);

    // função para abrir o formulário de adição de endereço
    const abrirPopupAdd = () => {
        Swal.fire({
            title: "Adicionar Novo Endereço",
            html: `
                <input id="apelido" type="text" placeholder="Apelido" class="swal2-input" style="width: 18rem;">
                <input id="numero" type="text" placeholder="Número" class="swal2-input" style="width: 18rem;">
                <input id="complemento" type="text" placeholder="Complemento" class="swal2-input" style="width: 18rem;">
                <select id="tipo" className="swal2-select" style="margin-top: 1rem; padding: 0.5rem; font-size: 1.25rem; border: 1px solid #ccc; border-radius: 4px; width: 18rem; height: 3.5rem; font-family: inherit; outline: none;" onfocus="this.style.borderColor = '#b1cae3'; this.style.borderWidth = '0.25rem';" onblur="this.style.borderColor = '#ccc'; this.style.borderWidth = '1px';">
                    <option value="" selected hidden>Tipo</option>
                    <option value="0">Entrega</option>
                    <option value="1">Cobrança</option>
                    <option value="2">Residencial</option>
                    <option value="3">Geral</option>
                </select>
                <input id="cep" type="text" placeholder="CEP" maxlength="9" class="swal2-input" style="width: 18rem;">
                <input id="observacao" type="text" placeholder="Observação" class="swal2-input" style="width: 18rem;">`,
            showCancelButton: true,
            confirmButtonText: "Adicionar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                const apelido = Swal.getPopup().querySelector("#apelido").value;
                const numero = Swal.getPopup().querySelector("#numero").value;
                const complemento = Swal.getPopup().querySelector("#complemento").value;
                const tipo = Swal.getPopup().querySelector("#tipo").value;
                const cep = cepMask(Swal.getPopup().querySelector("#cep").value);
                const observacao = Swal.getPopup().querySelector("#observacao").value;
                adicionarEndereco(apelido, numero, complemento, tipo, cep, observacao);
            },
        });

        // adicionando um ouvinte de evento ao campo de CEP para chamar a função handleZipCode
        const cepInput = document.getElementById('cep');
        const numberInput = document.getElementById('numero');
        cepInput.addEventListener('input', handleCep);
        numberInput.addEventListener('input', handleNumber);
    };

    // função para adicionar um novo endereço
    const adicionarEndereco = async (apelido, numero, complemento, tipo, cep, observacao) => {
        try {
            const token = getToken();
            const response = await fetch("http://localhost:8080/perfil/add/endereco", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    apelido,
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
                {Object.entries(enderecos).map(([tipo, dado], index) => (
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

export default Enderecos;
