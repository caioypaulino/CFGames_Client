import React from "react";
import styles from "./linhaDadosConta.module.css";
import iconEdit from "../../../assets/buttons/Frame (6).svg";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ClienteService from "../../../services/clienteService";

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
                    
                    return ClienteService.editarSenha(senhaAtual, novaSenha, confirmaSenha, navigate);
                }   
                else { 
                    const email  = Swal.getPopup().querySelector("#email").value;
                    
                    return ClienteService.editarEmail(email, navigate);
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
