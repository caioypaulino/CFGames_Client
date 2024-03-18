import React, { useEffect, useState } from "react";
import iconAdd from "../../../assets/buttons/add.svg";
import styles from "./AdminProdutos.module.css";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";

const AdminProdutos = () => {
    const [produtos, setProdutos] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [produtosPorPagina] = useState(9);
    const [colunaClassificada, setColunaClassificada] = useState(null);
    const [ordemClassificacao, setOrdemClassificacao] = useState('asc');

    useEffect(() => {
        const token = getToken();

        fetch('http://localhost:8080/admin/produtos', {
            headers: { Authorization: "Bearer " + token }
        })
        .then(resp => resp.json())
        .then(json => {
            const sortedProdutos = json.sort((a, b) => a.id - b.id); // Ordena os produtos por ID
            setProdutos(sortedProdutos);
        });
    }, []);

    const abrirPopupInfo = (produto) => {
        // Abre um modal com os detalhes do produto usando o SweetAlert2
        Swal.fire({
            title: produto.titulo,
            html: `
                <p>ID: ${produto.id}</p>
                <p>Gênero: ${produto.categorias.length > 0 ? produto.categorias[0].nome : ''}</p>
                <p>Preço: ${produto.preco}</p>
                <p>Quantidade: ${produto.quantidade}</p>
                <p>Descrição: ${produto.descricao}</p>
                <p>Plataforma: ${produto.plataforma}</p>
                <p>Data de Lançamento: ${produto.dataLancamento}</p>
                <p>Marca: ${produto.marca}</p>
                <p>Editora: ${produto.publisher}</p>
                <p>Peso: ${produto.peso}</p>
                <p>Dimensões (C x L x A): ${produto.comprimento} x ${produto.largura} x ${produto.altura}</p>
                <p>Código de Barras: ${produto.codigoBarras}</p>
                <p>Status: ${produto.status}</p>
            `,
            icon: 'info',
            confirmButtonText: 'Fechar',
            confirmButtonColor: "#6085FF"
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

    const indexUltimoProduto = paginaAtual * produtosPorPagina;
    const indexPrimeiroProduto = indexUltimoProduto - produtosPorPagina;

    // Condicionais para ordenar os produtos com base na coluna selecionada
    const sortedProdutos = [...produtos].sort((a, b) => {
        if (colunaClassificada === 'ID') {
            return ordemClassificacao === 'asc' ? a.id - b.id : b.id - a.id;
        } 
        else if (colunaClassificada === 'Título') {
            return ordemClassificacao === 'asc' ? a.titulo.localeCompare(b.titulo) : b.titulo.localeCompare(a.titulo);
        } 
        else if (colunaClassificada === 'Gênero') {
            const nomeA = a.categorias.length > 0 ? a.categorias[0].nome : '';
            const nomeB = b.categorias.length > 0 ? b.categorias[0].nome : '';
            return ordemClassificacao === 'asc' ? nomeA.localeCompare(nomeB) : nomeB.localeCompare(nomeA);
        } 
        else if (colunaClassificada === 'Preço') {
            return ordemClassificacao === 'asc' ? a.preco - b.preco : b.preco - a.preco;
        } 
        else if (colunaClassificada === 'Quantidade') {
            return ordemClassificacao === 'asc' ? a.quantidade - b.quantidade : b.quantidade - a.quantidade;
        }
        return 0;
    });

    const currentProdutos = sortedProdutos.slice(indexPrimeiroProduto, indexUltimoProduto);
    const totalPaginas = Math.ceil(produtos.length / produtosPorPagina);

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
                            <th onClick={() => handleSort('Título')}>
                                Título
                                {colunaClassificada === 'Título' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Gênero')}>
                                Gênero
                                {colunaClassificada === 'Gênero' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Preço')}>
                                Preço
                                {colunaClassificada === 'Preço' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Quantidade')}>
                                Quantidade
                                {colunaClassificada === 'Quantidade' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProdutos.map(produto => (
                            <tr key={produto.id}>
                                <td>{produto.id}</td>
                                <td>{produto.titulo}</td>
                                <td>{produto.categorias.length > 0 ? produto.categorias[0].nome : ''}</td>
                                <td>{produto.preco}</td>
                                <td>{produto.quantidade}</td>
                                <td>
                                    <button className={styles.buttonAcoes} onClick={() => abrirPopupInfo(produto)}>. . .</button>
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

export default AdminProdutos;
