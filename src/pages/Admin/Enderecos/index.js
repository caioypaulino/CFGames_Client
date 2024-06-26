import React, { useEffect, useState } from "react";
import iconAdd from "../../../assets/buttons/add.svg";
import styles from "./AdminEnderecos.module.css";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { handleCep } from "../../../utils/mask";
import { useNavigate } from "react-router-dom";
import AdminEnderecoService from "../../../services/Admin/adminEnderecoService";

const AdminEnderecos = () => {
    const [enderecos, setEnderecos] = useState([]);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [enderecosPorPagina] = useState(9);

    const [colunaClassificada, setColunaClassificada] = useState(null);
    const [ordemClassificacao, setOrdemClassificacao] = useState('asc');

    const navigate = useNavigate();

    useEffect(() => {
        const carregarEnderecos = async () => {
            const response = await AdminEnderecoService.buscarEnderecos(navigate);

            setEnderecos(response);
        }

        carregarEnderecos();
    }, []);

    // Abre os detalhes do endereço usando o SweetAlert2
    const abrirPopupInfo = (endereco) => {
        // Utilizando desestruturação de endereço
        const { cep, rua, bairro, cidade, estado, pais } = endereco;

        Swal.fire({
            title: rua,
            html: `
            <p>CEP: ${cep}</p>
            <p>Rua: ${rua}</p>
            <p>Bairro: ${bairro}</p>
            <p>Cidade: ${cidade}</p>
            <p>Estado: ${estado}</p>
            <p>País: ${pais}</p>
        `,
            showCancelButton: true,
            confirmButtonText: "Editar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Fechar",
            showDenyButton: true,
            denyButtonText: "Deletar",
            icon: 'info',
        }).then((result) => {
            if (result.isConfirmed) {
                abrirPopupUpdate(endereco);
            }
            else if (result.isDenied) {
                confirmarDelecao(endereco);
            }
        });
    };

    // Função para abrir o modal de atualização do endereço
    const abrirPopupUpdate = (endereco) => {
        // Utilizando desestruturação de endereço
        const { cep, rua, bairro, cidade, estado, pais } = endereco;

        Swal.fire({
            title: 'Editar Endereco',
            html: `
                <input id="rua" type="text" placeholder="Rua" value="${rua}" class="swal2-input" style="width: 18rem;"><br>
                <input id="bairro" type="text" placeholder="Bairro" value="${bairro}" class="swal2-input" style="width: 18rem;"><br>
                <input id="cidade" type="text" placeholder="Cidade" value="${cidade}" class="swal2-input" style="width: 18rem;"><br>
                <input id="estado" type="text" placeholder="Estado" value="${estado}" class="swal2-input" style="width: 18rem;"><br>
                <input id="pais" type="text" placeholder="País" value="${pais}" class="swal2-input" style="width: 18rem;"><br>
            `,
            showCancelButton: true,
            confirmButtonText: "Atualizar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                // Obtendo valores dos campos atualizados
                const rua = Swal.getPopup().querySelector('#rua').value;
                const bairro = Swal.getPopup().querySelector('#bairro').value;
                const cidade = Swal.getPopup().querySelector('#cidade').value;
                const estado = Swal.getPopup().querySelector('#estado').value;
                const pais = Swal.getPopup().querySelector('#pais').value;

                // Chamando a função para atualizar o endereço
                AdminEnderecoService.atualizarEndereco(cep, rua, bairro, cidade, estado, pais);
            }
        }).then((result) => {
            if (result.isDismissed) { // Se o usuário clicar em cancelar, volte para abrirPopupInfo
                abrirPopupInfo(endereco);
            }
        });
    };

    // Função para solicitar confirmação da deleção
    const confirmarDelecao = (endereco) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Esta ação não pode ser revertida!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar'
        })
            .then((result) => {
                if (result.isConfirmed) { // Se o botão "Confirmar" for clicado
                    AdminEnderecoService.deletarEndereco(endereco.cep);
                }
                else if (result.isDenied) { // Se o botão "Cancelar" for clicado
                    abrirPopupInfo(endereco);
                }
            });
    };

    const abrirPopupAdd = () => {
        Swal.fire({
            title: 'Adicionar Endereço',
            html: `
                <input id="cep" type="text" placeholder="CEP" maxlength="9" class="swal2-input">
            `,
            showCancelButton: true,
            confirmButtonText: "Adicionar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                const cep = Swal.getPopup().querySelector('#cep').value;

                AdminEnderecoService.adicionarEndereco(cep)
            },
        });

        // adicionando um ouvinte de evento ao campo de CEP para chamar a função handleZipCode
        const cepInput = document.getElementById('cep');
        cepInput.addEventListener('input', handleCep);
    };

    const handleSort = (coluna) => {
        if (coluna === colunaClassificada) {
            setOrdemClassificacao(ordem => (ordem === 'asc' ? 'desc' : 'asc'));
        }
        else {
            setColunaClassificada(coluna);
            setOrdemClassificacao('asc');
        }
    };

    const indexUltimoEndereco = paginaAtual * enderecosPorPagina;
    const indexPrimeiroEndereco = indexUltimoEndereco - enderecosPorPagina;

    // Condicionais para ordenar os endereços com base na coluna selecionada
    const sortedEnderecos = [...enderecos].sort((a, b) => {
        if (colunaClassificada === 'CEP') {
            return ordemClassificacao === 'asc' ? a.cep.localeCompare(b.cep) : b.cep.localeCompare(a.cep);
        }
        else if (colunaClassificada === 'Rua') {
            return ordemClassificacao === 'asc' ? a.rua.localeCompare(b.rua) : b.rua.localeCompare(a.rua);
        }
        else if (colunaClassificada === 'Bairro') {
            return ordemClassificacao === 'asc' ? a.bairro.localeCompare(b.bairro) : b.bairro.localeCompare(a.bairro);
        }
        else if (colunaClassificada === 'Cidade') {
            return ordemClassificacao === 'asc' ? a.cidade.localeCompare(b.cidade) : b.cidade.localeCompare(a.cidade);
        }
        else if (colunaClassificada === 'Estado') {
            return ordemClassificacao === 'asc' ? a.estado.localeCompare(b.estado) : b.estado.localeCompare(a.estado);
        }
        return 0;
    });

    const enderecosAtuais = sortedEnderecos.slice(indexPrimeiroEndereco, indexUltimoEndereco);
    const totalPaginas = Math.ceil(enderecos.length / enderecosPorPagina);

    const handlePaginaAnterior = () => {
        setPaginaAtual(paginaAnterior => Math.max(paginaAnterior - 1, 1));
    };

    const handleProximaPagina = () => {
        setPaginaAtual(paginaAnterior => Math.min(paginaAnterior + 1, totalPaginas));
    };

    return (
        <div className={styles.container}>
            <div className={styles.tbInfo}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('CEP')}>
                                CEP
                                {colunaClassificada === 'CEP' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Rua')}>
                                Rua
                                {colunaClassificada === 'Rua' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Bairro')}>
                                Bairro
                                {colunaClassificada === 'Bairro' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Cidade')}>
                                Cidade
                                {colunaClassificada === 'Cidade' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Estado')}>
                                Estado
                                {colunaClassificada === 'Estado' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enderecosAtuais.map(endereco => (
                            <tr key={endereco.cep}>
                                <td>{endereco.cep}</td>
                                <td>{endereco.rua}</td>
                                <td>{endereco.bairro}</td>
                                <td>{endereco.cidade}</td>
                                <td>{endereco.estado}</td>
                                <td>
                                    <button className={styles.buttonAcoes} onClick={() => abrirPopupInfo(endereco)}>. . .</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
        </div>
    );
};

export default AdminEnderecos;
