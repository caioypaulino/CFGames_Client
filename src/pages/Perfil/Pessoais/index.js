import React, { useEffect, useState } from "react";
import LinhaDadosPessoais from "../../../components/components_perfil/linhaDadosPessoais";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import styles from "./Pessoais.module.css";
import { useNavigate } from "react-router-dom";
import iconEdit from "../../../assets/buttons/Frame (6).svg";
import Swal from "sweetalert2";
import { handleCPF, cpfMask, handleTelefone, telefoneMask, dataMaskEN, removeMask } from '../../../utils/mask'; // Importando a função de máscara de CPF e telefone
import ClienteService from "../../../services/clienteService";

const pessoais = () => {
    const [cliente, setCliente] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const carregarPessoais = async () => {
            const response = await ClienteService.buscarPessoais(navigate);

            setCliente(response);
        }

        carregarPessoais();
    }, []); 

    // utilizando desestruturação
    const { nome, cpf, dataNascimento, genero, telefone } = cliente;

    const abrirPopupUpdate = () => {
        Swal.fire({
            title: "Editar Dados Pessoais",
            html: `
                <input id="nome" type="text" placeholder="Nome" value="${nome}" class="swal2-input" style="width: 18rem;"><br>
                <input id="cpf" type="text" placeholder="CPF" value="${cpfMask(cpf)}" maxlength="14" class="swal2-input" style="width: 18rem;"><br>
                <select id="genero" class="swal2-select" style="margin-top: 1rem; padding: 0.5rem; font-size: 1.25rem; border: 1px solid #ccc; border-radius: 4px; width: 18rem; height: 3.5rem; font-family: inherit; outline: none;" onfocus="this.style.borderColor = '#b1cae3'; this.style.borderWidth = '0.25rem';" onblur="this.style.borderColor = '#ccc'; this.style.borderWidth = '1px';">
                    <option value="MASCULINO" ${genero === 'MASCULINO' ? 'selected' : ''}>Masculino</option>
                    <option value="FEMININO" ${genero === 'FEMININO' ? 'selected' : ''}>Feminino</option>
                    <option value="OUTRO" ${genero === 'OUTRO' ? 'selected' : ''}>Outro</option>
                    <option value="NAO_INFORMAR" ${genero === 'NAO_INFORMAR' ? 'selected' : ''}>Não Informar</option>
                </select><br>
                <input id="dataNascimento" type="date" placeholder="Data de Nascimento" value="${dataNascimento}" class="swal2-input" style="width: 18rem;"><br>
                <input id="telefone" type="text" placeholder="Telefone" value="${telefoneMask(telefone)}" maxlength="15" class="swal2-input" style="width: 18rem;"><br>
            `,
            showCancelButton: true,
            confirmButtonText: "Salvar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                const nome = Swal.getPopup().querySelector("#nome").value;
                const cpf = removeMask(Swal.getPopup().querySelector("#cpf").value); // Removendo a máscara antes de enviar
                const genero = Swal.getPopup().querySelector("#genero").value;
                const dataNascimento = dataMaskEN(Swal.getPopup().querySelector("#dataNascimento").value);
                const telefone = removeMask(Swal.getPopup().querySelector("#telefone").value); // Removendo a máscara antes de enviar

                return ClienteService.editarDadosPessoais(nome, cpf, genero, dataNascimento, telefone);
            }
        });
        
        // Adicionando a máscara ao CPF
        const cpfInput = document.getElementById('cpf');
        cpfInput.addEventListener('input', handleCPF);

        // Adicionando a máscara ao telefone
        const telefoneInput = document.getElementById('telefone');
        telefoneInput.addEventListener('input', handleTelefone);
    };

    return (
        <div className={styles.container}>
            <div className={styles.tbActions}>
                <TabelaActions />
            </div>
            <div className={styles.tbInfo}>

                {Object.entries(cliente).map(([tipo, dado], index) => {
                    return <LinhaDadosPessoais key={index} tipo={tipo} dado={dado} />;
                })}

                <div className={styles.btnIconEdit}>
                    <button className={styles.btnIcon} onClick={abrirPopupUpdate}>
                        <img className={styles.iconEdit} src={iconEdit} alt="Editar" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default pessoais;