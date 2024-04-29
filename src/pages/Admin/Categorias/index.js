import React, { useEffect, useState } from "react";
import iconAdd from "../../../assets/buttons/add.svg";
import styles from "./AdminCategorias.module.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AdminCategoriaService from "../../../services/Admin/adminCategoriaService";

const AdminCategorias = () => {
    const [categorias, setCategorias] = useState([]);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [categoriasPorPagina] = useState(9);

    const [colunaClassificada, setColunaClassificada] = useState(null);
    const [ordemClassificacao, setOrdemClassificacao] = useState('asc');

    const navigate = useNavigate();

    useEffect(() => {
        const carregarCategorias = async () => {
            const response = await AdminCategoriaService.buscarCategorias(navigate);

            setCategorias(response);
        }

        carregarCategorias();
    }, []);

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
                AdminCategoriaService.atualizarCategoria(categoria.id, nome);
            }
        }).then((result) => {
            if (result.isDismissed) { // Se o usuário clicar em cancelar, volte para abrirPopupInfo
                abrirPopupInfo(categoria);
            }
        });
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
        }).then((result) => {
            if (result.isConfirmed) {
                AdminCategoriaService.deletarCategoria(categoria.id);
            }
            else if (result.isDismissed) {
                abrirPopupInfo(categoria);
            }
        });
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

                AdminCategoriaService.adicionarCategoria(nome)
            },
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
