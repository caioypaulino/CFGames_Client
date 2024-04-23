import React, { useEffect, useState } from "react";
import styles from "./AdminClientes.module.css";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { dataMaskBR, telefoneMask, cpfMask } from "../../../utils/mask";
import { useNavigate } from "react-router-dom";

const AdminClientes = () => {
    const [clientes, setClientes] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [clientesPorPagina] = useState(9);
    const [colunaClassificada, setColunaClassificada] = useState(null);
    const [ordemClassificacao, setOrdemClassificacao] = useState('asc');

    const navigate = useNavigate();

    useEffect(() => {
        carregarClientes();
    }, []);
    
    const carregarClientes = async () => {
        const token = getToken();
    
        try {
            const response = await fetch('http://localhost:8080/admin/clientes', {
                headers: { Authorization: "Bearer " + token }
            });
    
            if (response.ok) {
                const json = await response.json();
                const sortedClientes = json.sort((a, b) => a.id - b.id); // Ordena os clientes por ID
    
                setClientes(sortedClientes);
            } 
            else {
                if (response.status === 500) {
                    throw new Error('Token Inválido!');
                } 
                else if (response.status === 400) {
                    Swal.fire({ title: "Erro!", html: `Erro ao carregar endereços!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
                }
                else if (response.status === 403) {
                    Swal.fire({ title: "Erro!", html: `Você não possui permissão para acessar o painel de administrador.<br><br> Por favor, entre em contato com o administrador do sistema para mais informações.`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/perfil/pessoal"); });
                }
            }
        } 
        catch (error) {
            console.error('Erro ao carregar dados:', error);
            Swal.fire({ title: "Erro!", html: `Erro ao carregar painel de administrador.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
        }
    };

    // Abre os detalhes do cliente usando o SweetAlert2
    const abrirPopupInfo = (cliente) => {
        // Utilizando desestruturação de cliente
        const { id, nome, email, cpf, telefone, dataNascimento } = cliente;

        Swal.fire({
            title: nome,
            html: `
            <p>ID: ${id}</p>
            <p>Nome: ${nome}</p>
            <p>Email: ${email}</p>
            <p>CPF: ${cpfMask(cpf)}</p>
            <p>Telefone: ${telefoneMask(telefone)}</p>
            <p>Data de Nascimento: ${dataMaskBR(dataNascimento)}</p>
        `,
            showCancelButton: true,
            confirmButtonText: "Endereços",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Fechar",
            showDenyButton: true, // Adiciona um botão de negação (Deletar Cliente)
            denyButtonText: "Deletar",
            icon: 'info',
        }).then((result) => {
            if (result.isConfirmed) { // Se o botão "Endereços" for clicado
                abrirPopupEnderecos(cliente);
            }
            else if (result.isDenied) { // Se o botão "Deletar" for clicado
                confirmarDelecao(cliente);
            }
        });
    };

    // Formata os endereços do cliente
    const formatEnderecos = (enderecosCliente) => {
        return enderecosCliente.map((enderecoCliente) => {
            // Utilizando desestruturação de enderecoCliente e endereco
            const { id, apelido, numero, tipo, endereco } = enderecoCliente;
            const { cep, rua, bairro, cidade, estado, pais } = endereco;

            return `Endereço ${id}: ${apelido}, ${cep}, ${rua}, ${numero}, ${bairro}, ${cidade} - ${estado} (${pais}) [Tipo: ${tipo}]`;
        });
    };

    // Abre os endereços do cliente com SweetAlert2
    const abrirPopupEnderecos = (cliente) => {
        const enderecos = formatEnderecos(cliente.enderecos);

        const htmlContent = enderecos.map((endereco) => `<p>${endereco}</p>`).join('');

        Swal.fire({
            title: `Endereços`,
            html: htmlContent,
            icon: 'info',
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
        })
        .then((result) => {
            if (result.isConfirmed) { // Se o botão "Confirmar" for clicado
                deletarCliente(cliente.id);
            }
            else if (result.isDenied) { // Se o botão "Cancelar" for clicado
                abrirPopupInfo(cliente);
            }
        });
    };

    // Função para deletar um cliente
    const deletarCliente = async(clienteId) => {
        try {
            const token = getToken();

            const response = await fetch(`http://localhost:8080/admin/clientes/delete/${clienteId}`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json'
                },
            });


            if (response.ok) {
                const successMessage = await response.text();

                Swal.fire({ title: "Sucesso!", html: `${successMessage}`, icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            }
            else {
                // buscando mensagem de erro que não é JSON
                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }
        }
        catch (error) {
            // tratando mensagem de erro
            console.error("Erro ao deletar cliente:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao deletar o cliente.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
        }
    };

    const handleSort = (coluna) => {
        if (coluna === colunaClassificada) {
            setOrdemClassificacao(ordem => (ordem === 'asc' ? 'desc' : 'asc'));
        } else {
            setColunaClassificada(coluna);
            setOrdemClassificacao('asc');
        }
    };

    const indexUltimoCliente = paginaAtual * clientesPorPagina;
    const indexPrimeiroCliente = indexUltimoCliente - clientesPorPagina;

    // Condicionais para ordenar os clientes com base na coluna selecionada
    const sortedClientes = [...clientes].sort((a, b) => {
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
    const totalPaginas = Math.ceil(clientes.length / clientesPorPagina);

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
                                <td>{cliente.telefone}</td>
                                <td>
                                    <button className={styles.buttonAcoes} onClick={() => abrirPopupInfo(cliente)}>. . .</button>
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
            </div>
        </div>
    );
};

export default AdminClientes;
