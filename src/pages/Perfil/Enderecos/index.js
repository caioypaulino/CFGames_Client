import React, { useEffect, useState } from "react";
import LinhaDadosEnderecos from "../../../components/components_perfil/linhaDadosEnderecos";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import iconAdd from "../../../assets/buttons/add.svg"
import styles from "./Enderecos.module.css";
import Swal from "sweetalert2";
import { handleCep, cepMask, handleNumber } from '../../../utils/mask';
import { useNavigate } from "react-router-dom";
import EnderecoService from "../../../services/enderecoService";

const Enderecos = () => {
    const [enderecos, setEnderecos] = useState([]);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [enderecosPorPagina] = useState(5);

    const navigate = useNavigate();

    useEffect(() => {
        const carregarEnderecos = async () => {
            const response = await EnderecoService.buscarEnderecos(navigate);

            setEnderecos(response);
        }
        
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

                EnderecoService.adicionarEndereco(apelido, numero, complemento, tipo, cep, observacao);
            },
        });

        // adicionando um ouvinte de evento ao campo de CEP para chamar a função handleZipCode
        const cepInput = document.getElementById('cep');
        const numberInput = document.getElementById('numero');
        cepInput.addEventListener('input', handleCep);
        numberInput.addEventListener('input', handleNumber);
    };

    const indexUltimoEndereco = paginaAtual * enderecosPorPagina;
    const indexPrimeiroEndereco = indexUltimoEndereco - enderecosPorPagina;

    const enderecosAtuais = enderecos.slice(indexPrimeiroEndereco, indexUltimoEndereco);
    const totalPaginas = Math.ceil(enderecos.length / enderecosPorPagina);

    const handlePaginaAnterior = () => {
        setPaginaAtual(paginaAnterior => Math.max(paginaAnterior - 1, 1));
    };

    const handleProximaPagina = () => {
        setPaginaAtual(paginaAnterior => Math.min(paginaAnterior + 1, totalPaginas));
    };

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.tbActions}>
                    <TabelaActions />
                </div>
                <div className={styles.tbInfo}>
                    {Object.entries(enderecosAtuais).map(([tipo, dado], index) => (
                        <LinhaDadosEnderecos key={index} index={index + 1} tipo={tipo} dado={dado} />
                    ))}

                </div>
            </div>
            <div className={styles.pagination}>
                <button onClick={handlePaginaAnterior} disabled={paginaAtual === 1}>&lt;</button>
                <span className={styles.paginaAtual}>{paginaAtual}</span><span className={styles.totalPaginas}>/{totalPaginas}</span>
                <button onClick={handleProximaPagina} disabled={paginaAtual === totalPaginas}>&gt;</button>
            </div>
            <div className={styles.btnIconAdd}>
                <button className={styles.btnIcon} onClick={abrirPopupAdd}>
                    <img className={styles.iconAdd} src={iconAdd} alt="Adicionar" />
                </button>
            </div>
        </div>

    );
};

export default Enderecos;
