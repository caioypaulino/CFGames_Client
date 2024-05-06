import React, { useEffect, useState } from "react";
import iconFilter from "../../../assets/buttons/filter.svg";
import styles from "./AdminClientes.module.css";
import Swal from "sweetalert2";
import { dataMaskBR, telefoneMask, cpfMask, generoMask } from "../../../utils/mask";
import { useNavigate } from "react-router-dom";
import FormFiltrarClientes from "../../../components/components_filtro/FormFiltrarClientes";
import AdminClienteService from "../../../services/Admin/adminClienteService";

const AdminClientes = () => {
    const [clientes, setClientes] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [clientesPorPagina] = useState(9);
    const [colunaClassificada, setColunaClassificada] = useState(null);
    const [ordemClassificacao, setOrdemClassificacao] = useState('asc');

    const [clientesFiltrados, setClientesFiltrados] = useState([]);

    const [filtro, setFiltro] = useState({
        id: "",
        nome: "",
        cpf: "",
        diaNascimento: "",
        mesNascimento: "",
        anoNascimento: "",
        generos: [],
        telefone: "",
        email: ""
    });

    const [abrirFormFiltrarClientes, setAbrirFormFiltrarClientes] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const carregarClientes = async () => {
            const response = await AdminClienteService.buscarClientes(navigate);

            setClientes(response);
            setClientesFiltrados(response);
        }

        carregarClientes();
    }, []);

    // Abre os detalhes do cliente usando o SweetAlert2
    const abrirPopupInfo = (cliente) => {
        // Utilizando desestruturação de cliente
        const { id, nome, email, cpf, genero, telefone, dataNascimento } = cliente;

        const detalhesCliente = `
            <div class=${styles.justifyText}>
                <hr>
                <h2>Geral</h2>
                <p><strong>ID:</strong> #${id}</p>
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>CPF:</strong> ${cpfMask(cpf)}</p>
                <br>
                <p><strong>Gênero:</strong> ${generoMask(genero)}</p>
                <p><strong>Telefone:</strong> ${telefoneMask(telefone)}</p>
                <p><strong>Data de Nascimento:</strong> ${dataMaskBR(dataNascimento)}</p>
                <br>
                <hr>
            </div>
        `;

        Swal.fire({
            title: `<h3 style='color:#011640;'>${nome}</h3>`,
            html: detalhesCliente,
            showCancelButton: true,
            confirmButtonText: "Endereços",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Fechar",
            showDenyButton: true, // Adiciona um botão de negação (Deletar Cliente)
            denyButtonText: "Deletar",
        }).then((result) => {
            if (result.isConfirmed) { // Se o botão "Endereços" for clicado
                abrirPopupEnderecos(cliente);
            }
            else if (result.isDenied) { // Se o botão "Deletar" for clicado
                confirmarDelecao(cliente);
            }
        });
    };

    // Abre os endereços do cliente com SweetAlert2
    const abrirPopupEnderecos = (cliente) => {
        const detalhesEnderecos = `
            <div class=${styles.justifyText}>
                <hr>
                ${cliente.enderecos.sort((a, b) => a.id - b.id).map((endereco) => {
                const { id, apelido, numero, tipo } = endereco;
                const { cep, rua, bairro, cidade, estado, pais } = endereco.endereco;

                return `
                    <h3 style='margin-left:2%;'><strong>ID #${id}</strong></h3>
                    <p><strong>Tipo:</strong> ${tipo}</p>
                    <p><strong>Apelido:</strong> ${apelido}</p>
                    <p><strong>Endereço:</strong> ${cep}, ${rua}, ${numero}, ${bairro}, ${cidade} - ${estado} (${pais})</p>
                    <br>
                    <hr>
                `;
                }).join("")}
            </div>
        `;

        Swal.fire({
            title: `<h3 style='color:#011640;'>Endereços Cliente</h3>`,
            html: detalhesEnderecos,
            confirmButtonText: 'Voltar',
            confirmButtonColor: "#6085FF",
            width: '50rem'
        }).then((result) => {
            if (result.isConfirmed) {
                abrirPopupInfo(cliente);
            }
        });
    };

    // Função para solicitar confirmação da deleção
    const confirmarDelecao = (cliente) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Esta ação não pode ser revertida!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) { // Se o botão "Confirmar" for clicado
                AdminClienteService.deletarCliente(cliente.id);
            }
            else if (result.isDenied) { // Se o botão "Cancelar" for clicado
                abrirPopupInfo(cliente);
            }
        });
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

    const indexUltimoCliente = paginaAtual * clientesPorPagina;
    const indexPrimeiroCliente = indexUltimoCliente - clientesPorPagina;

    // Condicionais para ordenar os clientes com base na coluna selecionada
    const sortedClientes = [...clientesFiltrados].sort((a, b) => {
        if (colunaClassificada === 'ID') {
            return ordemClassificacao === 'asc' ? a.id - b.id : b.id - a.id;
        }
        else if (colunaClassificada === 'Nome') {
            return ordemClassificacao === 'asc' ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome);
        }
        else if (colunaClassificada === 'Email') {
            return ordemClassificacao === 'asc' ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email);
        }
        else if (colunaClassificada === 'Telefone') {
            return ordemClassificacao === 'asc' ? a.telefone.localeCompare(b.telefone) : b.telefone.localeCompare(a.telefone);
        }
        return 0;
    });

    const clientesAtuais = sortedClientes.slice(indexPrimeiroCliente, indexUltimoCliente);
    const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);

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
                            <th onClick={() => handleSort('ID')}>
                                ID
                                {colunaClassificada === 'ID' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Nome')}>
                                Nome
                                {colunaClassificada === 'Nome' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Email')}>
                                Email
                                {colunaClassificada === 'Email' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Telefone')}>
                                Telefone
                                {colunaClassificada === 'Telefone' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientesAtuais.map(cliente => (
                            <tr key={cliente.id}>
                                <td>{cliente.id}</td>
                                <td>{cliente.nome}</td>
                                <td>{cliente.email}</td>
                                <td>{telefoneMask(cliente.telefone)}</td>
                                <td>
                                    <button className={styles.buttonAcoes} onClick={() => abrirPopupInfo(cliente)}>. . .</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <FormFiltrarClientes
                    isOpen={abrirFormFiltrarClientes}
                    onRequestClose={() => setAbrirFormFiltrarClientes(false)}
                    filtro={filtro}
                    setFiltro={setFiltro}
                    clientes={clientes}
                    setClientesFiltrados={setClientesFiltrados}
                />
                <div className={styles.pagination}>
                    <button onClick={handlePaginaAnterior} disabled={paginaAtual === 1}>&lt;</button>
                    <span className={styles.paginaAtual}>{paginaAtual}</span><span className={styles.totalPaginas}>/{totalPaginas}</span>
                    <button onClick={handleProximaPagina} disabled={paginaAtual === totalPaginas}>&gt;</button>
                </div>
                <div className={styles.btnIconFilter}>
                    <button className={styles.btnIcon} onClick={() => setAbrirFormFiltrarClientes(true)}>
                        <img className={styles.iconFilter} src={iconFilter} alt="Filtrar" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminClientes;
