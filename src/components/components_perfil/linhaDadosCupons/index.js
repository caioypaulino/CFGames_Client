import React from "react";
import styles from "./linhaDadosCupons.module.css";
import Swal from "sweetalert2";
import iconInfo from "../../../assets/buttons/info.svg";
import iconDelete from "../../../assets/buttons/delete.svg";
import { getToken } from "../../../utils/storage";
import { creditCardMask, creditCardXXXXMask, dataHoraMaskBR, valueMaskBR } from "../../../utils/mask";

const linhaDadosCupons = (props) => {
    // Utilizando desestruturação
    const { codigoCupom, valorDesconto, data, validade, disponivel } = props.dado;

    // Função para abrir popup de informações
    const abrirPopupInfo = () => {
        Swal.fire({
            title: "Informações do Cupom",
            html: `
                <p><strong>Código:</strong> ${codigoCupom}</p>
                <p><strong>Valor de Desconto:</strong>R$ ${valueMaskBR(valorDesconto)}</p>
                <p><strong>Data de Emissão:</strong> ${dataHoraMaskBR(data)}</p>
                <p><strong>Data de Validade:</strong> ${dataHoraMaskBR(validade)}</p>
                <p><strong>Disponível:</strong> ${disponivel ? 'Sim' : 'Não'}</p>`,
            confirmButtonColor: "#6085FF",
            icon: "info"
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <p className={styles.infoLabel}>Código do Cupom: {codigoCupom}</p>
                <hr className={styles.infoDivider}></hr>
                <p className={styles.infoLabel}>Valor de Desconto: R$ {valueMaskBR(valorDesconto)}</p>
                <p className={styles.infoLabel}>Data de Validade: R$ {dataHoraMaskBR(validade)}</p>
            </div>
            <div className={styles.icons}>
                <button className={styles.btnIconInfo} onClick={abrirPopupInfo}>
                    <img className={styles.iconInfo} src={iconInfo} alt="Informações" />
                </button>
            </div>
        </div>
    );
};

export default linhaDadosCupons;