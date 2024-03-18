import React from "react";
import styles from "./linhaDadosConta.module.css";
import iconEdit from "../../../assets/buttons/Frame (6).svg";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { useNavigate } from "react-router-dom";

const linhaDadosConta = (props) => {
    const navigate = useNavigate();

    const abrirPopupUpdate = () => {
        Swal.fire({
            title: `Editar ${props.tipo}`,
            html: props.tipo === 'Senha' ? renderizarPopupSenha() : renderizarPopupEmail(),
            showCancelButton: true,
            confirmButtonText: "Salvar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                if (props.tipo === 'Senha') {
                    const senhaAtual = Swal.getPopup().querySelector("#senhaAtual").value;
                    const novaSenha = Swal.getPopup().querySelector("#novaSenha").value;
                    const confirmaSenha = Swal.getPopup().querySelector("#confirmaSenha").value;
                    
                    return editarSenha(senhaAtual, novaSenha, confirmaSenha);
                }   
                else { 
                    const email  = Swal.getPopup().querySelector("#email").value;
                    
                    return editarEmail(email);
                }
            }
        });
    };

    const renderizarPopupEmail = () => {
        return `<input id="email" type="email" placeholder="${props.tipo}" value="${props.dado}" class="swal2-input"><br>`;
    };

    const renderizarPopupSenha = () => {
        return `
            <input id="senhaAtual" type="password" placeholder="Senha Atual" class="swal2-input"><br>
            <input id="novaSenha" type="password" placeholder="Nova Senha" class="swal2-input"><br>
            <input id="confirmaSenha" type="password" placeholder="Confirmação da Nova Senha" class="swal2-input"><br>
        `;
    };

    const editarEmail = async (email) => {
        try {
            const token = getToken();
            let url = "http://localhost:8080/perfil/update/email";     

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify({
                    email: email
                })
            });

            if (response.ok) {
                Swal.fire({ title: "Sucesso!", text: `E-mail atualizado com sucesso.`, icon: "success", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login") });
            } 
            else {
                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }
        } 
        catch (error) {
            console.error(`Erro ao atualizar ${props.tipo.toLowerCase()}:`, error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao atualizar E-mail.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
        }
    };
    
    const editarSenha = async (senhaAtual, novaSenha, confirmaSenha) => {
        try {
            const token = getToken();
            const url = "http://localhost:8080/perfil/update/senha";

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify({
                    senhaAtual,
                    senha: novaSenha,
                    confirmaSenha: confirmaSenha
                })
            });

            if (response.ok) {
                Swal.fire({ title: "Sucesso!", text: "Senha atualizada com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.href = "/login" });
            } 
            else {
                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }
        } 
        catch (error) {
            console.error("Erro ao atualizar senha:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao atualizar a senha.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
        }
    };

    return (
        <div className={styles.container}>
            <p className={styles.type}>{props.tipo}:</p>
            <p className={styles.data}>{props.dado}</p>
            <div className={styles.btnIconEdit}>
                <button className={styles.btnIcon} onClick={abrirPopupUpdate}>
                    <img className={styles.iconEdit} src={iconEdit} alt="Editar" />
                </button>
            </div>
        </div>
    );
};

export default linhaDadosConta;
