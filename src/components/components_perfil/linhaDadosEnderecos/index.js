import React from "react";
import styles from "./linhaDadosEnderecos.module.css";
import Swal from "sweetalert2";
import icon from "../../../assets/buttons/Frame (6).svg";
import { getToken } from "../../../utils/storage";

const linhaDadosEnderecos = (props) => {
    // utilizando desestruturação
    const { id, complemento, tipo, observacao, numero, endereco } = props.dado;
    const { cep, rua, bairro, cidade, estado, pais } = endereco;

    // formatando endereço utilizando Template Literals
    const enderecoFormatado = `${cep}, ${rua}, ${numero}, ${bairro}, ${cidade}, ${estado}`;

    // utilizando sweet alert 2 como popup para informações e edição
    const abrirPopup = () => {
        Swal.fire({
            title: `Endereço ${props.index}`,
            html: ` 
                <p><strong>Tipo:</strong> ${tipo}</p>
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
                abrirPopupEdicao();
            }
        });
    };

    const abrirPopupEdicao = () => {
        Swal.fire({
            title: `Editar Endereço ${props.index}`,
            html: `Aqui você pode editar o endereço.<br>
                <input id="numero" type="text" placeholder="Número" value="${numero}" class="swal2-input"><br>
                <input id="complemento" type="text" placeholder="Complemento" value="${complemento}" class="swal2-input"><br>
                <input id="tipo" type="text" placeholder="Tipo" value="${tipo}" class="swal2-input"><br>
                <input id="cep" type="text" placeholder="CEP" value="${cep}" class="swal2-input"><br>
                <input id="observacao" type="text" placeholder="Observação" value="${observacao ? observacao : ""}" class="swal2-input"><br>`,
            showCancelButton: true,
            confirmButtonText: "Salvar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                const numero = Swal.getPopup().querySelector("#numero").value;
                const complemento = Swal.getPopup().querySelector("#complemento").value;
                const tipo = Swal.getPopup().querySelector("#tipo").value;
                const cep = Swal.getPopup().querySelector("#cep").value;
                const observacao = Swal.getPopup().querySelector("#observacao").value;
                return editarEndereco(id, numero, complemento, tipo, cep, observacao);
            }
        });
    };

    const editarEndereco = async (id, numero, complemento, tipo, cep, observacao) => {
        try {
            const token = getToken();
            
            const response = await fetch(`http://localhost:8080/perfil/update/endereco/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization : "Bearer " + token
                },
                body: JSON.stringify({
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

    return (
        <div className={styles.container}>
            <p className="text">Endereço {props.index}:</p>
            <p className={styles.data}>{enderecoFormatado}</p>
            <button className={styles.btnIcon} onClick={abrirPopup}>
                <img className={styles.iconEdite} src={icon} alt="Editar" />
            </button>
        </div>
    );
};

export default linhaDadosEnderecos;
