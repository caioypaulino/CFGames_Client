import React from "react";
import styles from "./linhaDadosEnderecos.module.css";
import Swal from "sweetalert2";
import iconEdit from "../../../assets/buttons/Frame (6).svg";
import iconDelete from "../../../assets/buttons/delete.svg"
import { getToken } from "../../../utils/storage";
import { handleNumber, handleCep, cepMask } from '../../../utils/mask';

const linhaDadosEnderecos = (props) => {
    // utilizando desestruturação
    const { id, apelido, complemento, tipo, observacao, numero, endereco } = props.dado;
    const { cep, rua, bairro, cidade, estado, pais } = endereco;

    // formatando endereço utilizando Template Literals
    const enderecoFormatado = `${apelido}, ${cep}, ${rua}, ${numero}, ${bairro}, ${cidade} - ${estado}`;

    // utilizando sweet alert 2 como popup para informações e edição
    const abrirPopupInfo = () => {
        Swal.fire({
            title: `Endereço ${props.index}`,
            html: ` 
                <p><strong>Apelido:</strong> ${apelido}</p>
                <p><strong>Tipo:</strong> ${tipo === 'COBRANCA' ? 'COBRANÇA' : tipo}</p>
                <p><strong>Complemento:</strong> ${complemento}</p>
                <p><strong>Número:</strong> ${numero}</p>
                <p><strong>Bairro:</strong> ${bairro}</p>
                <p><strong>Cidade:</strong> ${cidade}</p>
                <p><strong>Estado:</strong> ${estado}</p>
                <p><strong>País:</strong> ${pais}</p>
                <p><strong>Observação:</strong> ${observacao ? observacao : ""}</p>`,
            showCancelButton: true,
            confirmButtonText: "Editar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Fechar",
            icon: "info"
        }).then((result) => {
            if (result.isConfirmed) {
                abrirPopupUpdate();
            }
        });
    };
    
    // utilizando sweet alert 2 como popup para Update Endereço
    const abrirPopupUpdate = () => {
        Swal.fire({
            title: `Editar Endereço ${props.index}`,
            html: `Aqui você pode editar o endereço.<br>
                <input id="apelido" type="text" placeholder="Apelido" value="${apelido}" class="swal2-input" style="width: 18rem;">
                <input id="numero" type="text" placeholder="Número" value="${numero}" class="swal2-input" style="width: 18rem;"><br>
                <input id="complemento" type="text" placeholder="Complemento" value="${complemento}" class="swal2-input" style="width: 18rem;"><br>
                <select id="tipo" className="swal2-select" style="margin-top: 1rem; padding: 0.5rem; font-size: 1.25rem; border: 1px solid #ccc; border-radius: 4px; width: 18rem; height: 3.5rem; font-family: inherit; outline: none;" onfocus="this.style.borderColor = '#b1cae3'; this.style.borderWidth = '0.25rem';" onblur="this.style.borderColor = '#ccc'; this.style.borderWidth = '1px';">
                    <option defaultValue=${tipo} selected disabled hidden>${tipo}</option>
                    <option value="" disabled hidden>Tipo</option>
                    <option value="0">Entrega</option>
                    <option value="1">Cobrança</option>
                    <option value="2">Residencial</option>
                    <option value="3">Geral</option>
                </select>
                <input id="cep" type="text" placeholder="CEP" value="${cep}" maxlength="9" class="swal2-input" style="width: 18rem;"><br>
                <input id="observacao" type="text" placeholder="Observação" value="${observacao ? observacao : ""}" class="swal2-input" style="width: 18rem;"><br>`,
            showCancelButton: true,
            confirmButtonText: "Salvar",
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
                return editarEndereco(id, apelido, numero, complemento, tipo, cep, observacao);
            }
        });
        
        // adicionando um ouvinte de evento ao campo de CEP para chamar a função handleCep que cria uma máscara dinâmica
        const cepInput = document.getElementById('cep');
        const numberInput = document.getElementById('numero');
        cepInput.addEventListener('input', handleCep);
        numberInput.addEventListener('input', handleNumber);
    };

    // função request update endereço
    const editarEndereco = async (id, apelido, numero, complemento, tipo, cep, observacao) => {
        try {
            const token = getToken();
            
            const response = await fetch(`http://localhost:8080/perfil/update/endereco/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization : "Bearer " + token
                },
                body: JSON.stringify({
                    apelido,
                    numero,
                    complemento,
                    tipo,
                    endereco: {
                        cep
                    },
                    observacao
                })
            });

            if (response.ok) {
                Swal.fire({title:"Sucesso!", text:"Endereço atualizado com sucesso.", icon:"success", confirmButtonColor:"#6085FF"}).then(() => { window.location.reload(); }); // Recarregar a página após o update
            } 
            else {
                // buscando mensagem de erro que não é JSON
                const errorMessage = await response.text();
                
                throw new Error(errorMessage);
            }
        } 
        catch (error) {
            // tratando mensagem de erro
            console.error("Erro ao atualizar endereço:", error);
            Swal.fire({title:"Erro!", html: `Ocorreu um erro ao atualizar o endereço.<br><br>${error.message}`, icon:"error", confirmButtonColor:"#6085FF"})
        }
    };

    // utilizando sweet alert 2 como popup para Delete Endereço
    const abrirPopupDelete = () => {
        Swal.fire({
            title: "Tem certeza?",
            text: "Você deseja excluir este endereço?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6085FF",
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                // Chamar função para excluir o endereço
                excluirEndereco(id);
            }
        });
    };

    // função request delete endereço
    const excluirEndereco = async (enderecoId) => {
        try {
            const token = getToken();

            const response = await fetch("http://localhost:8080/perfil/remove/endereco", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    id: enderecoId,
                }),
            });

            if (response.ok) {
                // Exibindo mensagem de sucesso
                Swal.fire({title:"Removido!", text:"Endereço foi removido com sucesso.", icon:"success", confirmButtonColor:"#6085FF"}).then(() => { window.location.reload(); });
                // Recarregar a página ou atualizar os dados, conforme necessário
            } 
            else {
                // buscando mensagem de erro que não é JSON
                const errorMessage = await response.text();
                
                throw new Error(errorMessage);
            }
        } 
        catch (error) {
            // tratando mensagem de erro
            console.error("Erro ao excluir endereço:", error);
            Swal.fire({title:"Erro!", html: `Ocorreu um erro ao excluir o endereço.<br><br>${error.message}`, icon:"error", confirmButtonColor:"#6085FF"})
        }
    };

    return (
        <div className={styles.container}>
            <p className={styles.data}>{tipo}: {enderecoFormatado}</p>
            <div className={styles.icons}>
                <button className={styles.btnIcon} onClick={abrirPopupInfo}>
                    <img className={styles.iconEdite} src={iconEdit} alt="Editar" />
                </button>
            </div>
            <div className={styles.icons}>
                <button className={styles.btnIcon} onClick={abrirPopupDelete}>
                    <img className={styles.iconDelete} src={iconDelete} alt="Excluir" />
                </button>
            </div>
        </div>
        
    );
};

export default linhaDadosEnderecos;
