import React, { useEffect, useState } from "react";
import iconAdd from "../../../assets/buttons/add.svg";
import styles from "./AdminCategorias.module.css";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { useNavigate } from "react-router-dom";

const AdminCategorias = () => {
    const [categorias, setCategorias] = useState([]);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [categoriasPorPagina] = useState(9);

    const [colunaClassificada, setColunaClassificada] = useState(null);
    const [ordemClassificacao, setOrdemClassificacao] = useState('asc');

    const navigate = useNavigate();

    useEffect(() => {
        carregarCategorias();
    }, []);

    const carregarCategorias = async () => {
        const token = getToken();

        try {
            const response = await fetch('http://localhost:8080/admin/categorias', {
                headers: { Authorization: "Bearer " + token }
            });

            if (response.ok) {
                const json = await response.json();
                const sortedCategorias = json.sort((a, b) => a.id - b.id);

                setCategorias(sortedCategorias); // Definindo categorias
            } else {
                if (response.status === 500) {
                    throw new Error('Token Inválido!');
                }
                else if (response.status === 400) {
                    Swal.fire({ title: "Erro!", html: `Erro ao carregar categorias!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
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
    // Abre um modal com os detalhes da categoria usando o SweetAlert2
    const abrirPopupInfo = (categoria) => {
        Swal.fire({
            title: 'Categoria',
            html: `
                <p>ID: ${categoria.id}</p>
                <p>Nome: ${categoria.nome}</p>
            `,
            showCancelButton: true,
            confirmButtonText: "Editar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Fechar",
            showDenyButton: true,
            denyButtonText: "Deletar",
            icon: 'info',
        }).then((result) => {
            if (result.isConfirmed) { // Se o botão "Editar" for clicado
                abrirPopupUpdate(categoria);
            }
            else if (result.isDenied) { // Se o botão "Deletar" for clicado
                abrirPopupDelete(categoria);
            }
        });
    };

    // Função para abrir o modal de atualização da categoria
    const abrirPopupUpdate = (categoria) => {
        Swal.fire({
            title: 'Editar Categoria',
            html: `
                <input id="nome" type="text" placeholder="Nome" value="${categoria.nome}" class="swal2-input" style="width: 18rem;"><br>
            `,
            showCancelButton: true,
            confirmButtonText: "Atualizar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                // Obtendo valores dos campos atualizados
                const nome = Swal.getPopup().querySelector('#nome').value;

                // Chamando a função para atualizar o categoria
                atualizarCategoria(categoria.id, nome);
            }
        }).then((result) => {
            if (result.isDismissed) { // Se o usuário clicar em cancelar, volte para abrirPopupInfo
                abrirPopupInfo(categoria);
            }
        });
    };

    // Função para atualizar a categoria
    const atualizarCategoria = async (categoriaId, nome) => {
        try {
            const token = getToken();
            const response = await fetch(`http://localhost:8080/admin/categorias/update/${categoriaId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    nome
                }),
            });

            if (response.ok) {
                const successMessage = await response.text();
                Swal.fire({ title: "Sucesso!", html: `${successMessage}`, icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            }
            else {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        }
        catch (error) {
            console.error("Erro ao atualizar categoria:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao atualizar a categoria.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
        }
    };

    // Função para solicitar confirmação da deleção de categoria
    const abrirPopupDelete = (categoria) => {
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
                if (result.isConfirmed) {
                    deletarCategoria(categoria.id);
                }
                else if (result.isDismissed) {
                    abrirPopupInfo(categoria);
                }
            });
    };

    // Função para deletar uma categoria
    const deletarCategoria = async (categoriaId) => {
        try {
            const token = getToken();

            const response = await fetch(`http://localhost:8080/admin/categorias/delete/${categoriaId}`, {
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
                // Buscando mensagem de erro que não é JSON
                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }
        }
        catch (error) {
            // Tratando mensagem de erro
            console.error("Erro ao deletar categoria:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao deletar a categoria.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
        }
    };

    const abrirPopupAdd = () => {
        Swal.fire({
            title: 'Adicionar Categoria',
            html: `
                <input id="nome" type="text" class="swal2-input" placeholder="Nome">
            `,
            showCancelButton: true,
            confirmButtonText: "Adicionar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                const nome = Swal.getPopup().querySelector('#nome').value;

                adicionarCategoria(nome)
            },
        });
    };

    // Função para adicionar categoria
    const adicionarCategoria = async (nome) => {
        try {
            const token = getToken();

            const response = await fetch("http://localhost:8080/admin/categorias/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    nome
                }),
            });

            if (response.ok) {
                Swal.fire({ title: "Sucesso!", text: "Categoria adicionada com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            }
            else {
                // Buscando mensagem de erro que não é JSON
                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }
        }
        catch (error) {
            // Tratando mensagem de erro
            console.error("Erro ao adicionar categoria:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar a categoria.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
        }
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

    const indexUltimaCategoria = paginaAtual * categoriasPorPagina;
    const indexPrimeiraCategoria = indexUltimaCategoria - categoriasPorPagina;

    // Condicionais para ordenar as categorias com base na coluna selecionada
    const sortedCategorias = [...categorias].sort((a, b) => {
        if (colunaClassificada === 'ID') {
            return ordemClassificacao === 'asc' ? a.id - b.id : b.id - a.id;
        }
        else if (colunaClassificada === 'Nome') {
            return ordemClassificacao === 'asc' ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome);
        }
        return 0;
    });

    const categoriasAtuais = sortedCategorias.slice(indexPrimeiraCategoria, indexUltimaCategoria);
    const totalPaginas = Math.ceil(categorias.length / categoriasPorPagina);

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
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoriasAtuais.map(categoria => (
                            <tr key={categoria.id}>
                                <td>{categoria.id}</td>
                                <td>{categoria.nome}</td>
                                <td>
                                    <button className={styles.buttonAcoes} onClick={() => abrirPopupInfo(categoria)}>. . .</button>
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

export default AdminCategorias;
