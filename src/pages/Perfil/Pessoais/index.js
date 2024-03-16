import React, { useEffect, useState } from "react";
import LinhaDadosPessoais from "../../../components/components_perfil/linhaDadosPessoais";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import styles from "./Pessoais.module.css";
import { getToken } from "../../../utils/storage";
import iconEdit from "../../../assets/buttons/Frame (6).svg";
import Swal from "sweetalert2";
import { handleCPF, cpfMask, handleTelefone, telefoneMask } from '../../../utils/mask'; // Importando a função de máscara de CPF e telefone

const pessoais = () => {
    const [cliente, setCliente] = useState({});

    useEffect(() => {
        const token = getToken();

        fetch('http://localhost:8080/perfil/pessoal', {
            headers: { Authorization: "Bearer " + token }
        }).then(resp => resp.json()).then(json => setCliente(json));

        // setCliente(clienteData);
    }, []);

    // utilizando desestruturação
    const { nome, cpf, dataNascimento, genero, telefone } = cliente;

    const abrirPopupUpdate = () => {
        Swal.fire({
            title: "Editar Dados Pessoais",
            html: `
                <input id="nome" type="text" placeholder="Nome" value="${nome}" class="swal2-input" style="width: 18rem;"><br>
                <input id="cpf" type="text" placeholder="CPF" value="${cpfMask(cpf)}" maxlength="14" class="swal2-input" style="width: 18rem;"><br>
                <select id="genero" class="swal2-select" style="margin-top: 1rem; padding: 0.5rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 4px; width: 18rem; height: 3.5rem">
                    <option value="MASCULINO" ${genero === 'MASCULINO' ? 'selected' : ''}>Masculino</option>
                    <option value="FEMININO" ${genero === 'FEMININO' ? 'selected' : ''}>Feminino</option>
                    <option value="OUTRO" ${genero === 'OUTRO' ? 'selected' : ''}>Outro</option>
                    <option value="NAO_INFORMAR" ${genero === 'NAO_INFORMAR' ? 'selected' : ''}>Não Informar</option>
                </select><br>
                <input id="dataNascimento" type="date" placeholder="Data de Nascimento" value="${dataNascimento}" class="swal2-input" style="width: 18rem;"><br>
                <input id="telefone" type="text" placeholder="Telefone" value="${telefoneMask(telefone)}" maxlength="15" class="swal2-input" style="width: 18rem;"><br>`,
            showCancelButton: true,
            confirmButtonText: "Salvar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                const nome = Swal.getPopup().querySelector("#nome").value;
                const cpf = (Swal.getPopup().querySelector("#cpf").value).replace(/\D/g,''); // Removendo a máscara antes de enviar
                const genero = Swal.getPopup().querySelector("#genero").value;
                const dataNascimento = formatarData(Swal.getPopup().querySelector("#dataNascimento").value);
                const telefone = (Swal.getPopup().querySelector("#telefone").value).replace(/\D/g,''); // Removendo a máscara antes de enviar
                return editarDadosPessoais(nome, cpf, genero, dataNascimento, telefone);
            }
        });
        
        // Adicionando a máscara ao CPF
        const cpfInput = document.getElementById('cpf');
        cpfInput.addEventListener('input', handleCPF);

        // Adicionando a máscara ao telefone
        const telefoneInput = document.getElementById('telefone');
        telefoneInput.addEventListener('input', handleTelefone);
    };
    
    const formatarData = (data) => {
        const dataSplit = data.split("-");
        return `${dataSplit[2]}-${dataSplit[1]}-${dataSplit[0]}`;
    };

    const editarDadosPessoais = async (nome, cpf, genero, dataNascimento, telefone) => {
        try {
            const token = getToken();
            
            const response = await fetch("http://localhost:8080/perfil/update/pessoal", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization : "Bearer " + token
                },
                body: JSON.stringify({
                    nome,
                    cpf: cpf,
                    genero,
                    dataNascimento,
                    telefone
                })
            });

            if (response.ok) {
                Swal.fire({ title: "Sucesso!", text: "Dados pessoais atualizados com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); }); // Recarregar a página após o update
            } else {
                // buscando mensagem de erro que não é JSON
                const errorMessage = await response.text();
                
                throw new Error(errorMessage);
            }
        } catch (error) {
            // tratando mensagem de erro
            console.error("Erro ao atualizar dados pessoais:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao atualizar os dados pessoais.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
        }
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
