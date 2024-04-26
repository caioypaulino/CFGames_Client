import React, { useEffect, useState } from "react";
import styles from "./tabelaPerfilSolicitacoes.module.css";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { dataHoraMaskBR, valueMaskBR, statusMask } from "../../../utils/mask";
import { cancelarSolicitacao } from "../../../services/solicitacoesService";


const TabelaPerfilSolicitacoes = (props) => {
    const { solicitacoes } = props;

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [solicitacoesPorPagina] = useState(6);

    const [colunaClassificada, setColunaClassificada] = useState(null);
    const [ordemClassificacao, setOrdemClassificacao] = useState('asc');

    // Abre um modal com os detalhes do pedido usando o SweetAlert2
    const abrirPopupInfo = (solicitacao) => {
        const detalhesSolicitacao = `
            <div class=${styles.justifyText}>
                <hr>
                <h2>Geral</h2>
                <p><strong>Status:</strong> ${statusMask(solicitacao.status)}</p>
                <p><strong>Data:</strong> ${dataHoraMaskBR(solicitacao.data)}</p>
                <p><strong>Data da Última Atualização:</strong> ${dataHoraMaskBR(solicitacao.dataAtualizacao)}</p>
                <p><strong>Observação:</strong> ${statusMask(solicitacao.observacao)}</p>
                <hr>
                <h2>Pedido</h2>
                <p><strong>Código:</strong> #${solicitacao.pedido.id}</p>
                <p><strong>Valor Total:</strong> R$ ${valueMaskBR(solicitacao.pedido.valorTotal)}</p>
                <p><strong>Valor Carrinho:</strong> R$ ${valueMaskBR(solicitacao.pedido.carrinhoCompra.valorCarrinho)}</p>
                <p><strong>Status:</strong> ${statusMask(solicitacao.pedido.status)}</p>
                <hr>
                <h2>Itens Solicitação</h2>
                <h3>Itens:</h3>
                ${solicitacao.itensTroca.sort((a, b) => a.id - b.id).map(item => {
            return `
                        <p><strong>Produto:</strong> ${item.itemCarrinho.produto.titulo}</p>
                        <p><strong>Quantidade Solicitação:</strong> ${item.quantidadeTroca}</p>
                        <p><strong>Preço Unitário:</strong> R$ ${valueMaskBR(item.itemCarrinho.produto.preco)}</p>
                        <p><strong>Valor Total do Item Solicitação:</strong> R$ ${valueMaskBR(item.itemCarrinho.produto.preco * item.quantidadeTroca)}</p>
                        <br>
                    `;
        }).join("")}
                <hr>
            </div>
        `;

        Swal.fire({
            title: `<h3 style='color:#011640;'>Solicitação de Troca/Devolução #${solicitacao.id}</h3>`,
            html: detalhesSolicitacao,
            confirmButtonText: "OK",
            confirmButtonColor: "#6085FF",
            showDenyButton: true,
            denyButtonText: "Cancelar Solicitação",
            width: '40%',
        }).then((result) => {
            if (result.isDenied) {
                abrirPopupCancel(solicitacao);
            }
        });
    };

    // Solicitar confirmação do cancelamento da solicitação
    const abrirPopupCancel = (solicitacao) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Esta ação não pode ser revertida!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, cancelar!',
            cancelButtonText: 'Voltar'
        })
            .then((result) => {
                if (result.isConfirmed) {
                    cancelarSolicitacao(solicitacao.id);
                }
                else if (result.isDismissed) {
                    abrirPopupInfo(solicitacao);
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

    const indexUltimaSolicitacao = paginaAtual * solicitacoesPorPagina;
    const indexPrimeiraSolicitacao = indexUltimaSolicitacao - solicitacoesPorPagina;

    // Condicionais para ordenar as solicitações com base na coluna selecionada
    const sortedSolicitacoes = [...solicitacoes].sort((a, b) => {
        if (colunaClassificada === 'ID') {
            return ordemClassificacao === 'asc' ? a.id - b.id : b.id - a.id;
        }
        else if (colunaClassificada === 'Data') {
            return ordemClassificacao === 'asc' ? new Date(a.data) - new Date(b.data) : new Date(b.data) - new Date(a.data);
        }
        else if (colunaClassificada === 'ID Pedido') {
            return ordemClassificacao === 'asc' ? a.pedido.id - b.pedido.id : b.pedido.id - a.pedido.id;
        }
        else if (colunaClassificada === 'Status') {
            return ordemClassificacao === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
        }
        else if (colunaClassificada === 'Ultima Atualizacao') {
            return ordemClassificacao === 'asc' ? new Date(a.dataAtualizacao) - new Date(b.dataAtualizacao) : new Date(b.dataAtualizacao) - new Date(a.dataAtualizacao);
        }
        return 0;
    });

    const solicitacoesAtuais = sortedSolicitacoes.slice(indexPrimeiraSolicitacao, indexUltimaSolicitacao);
    const totalPaginas = Math.ceil(solicitacoes.length / solicitacoesPorPagina);

    const handlePaginaAnterior = () => {
        setPaginaAtual(paginaAnterior => Math.max(paginaAnterior - 1, 1));
    };

    const handleProximaPagina = () => {
        setPaginaAtual(paginaAnterior => Math.min(paginaAnterior + 1, totalPaginas));
    };

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.tbInfo}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('ID')}>
                                    Código
                                    {colunaClassificada === 'ID' && (
                                        <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                    )}
                                </th>
                                <th onClick={() => handleSort('Data')}>
                                    Data
                                    {colunaClassificada === 'Data' && (
                                        <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                    )}
                                </th>
                                <th onClick={() => handleSort('ID Pedido')}>
                                    Código Pedido
                                    {colunaClassificada === 'ID Pedido' && (
                                        <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                    )}
                                </th>
                                <th onClick={() => handleSort('Status')}>
                                    Status
                                    {colunaClassificada === 'Status' && (
                                        <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                    )}
                                </th>
                                <th onClick={() => handleSort('Ultima Atualizacao')}>
                                    Última Atualização
                                    {colunaClassificada === 'Ultima Atualizacao' && (
                                        <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                    )}
                                </th>
                                <th>Detalhes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitacoesAtuais.map(solicitacao => (
                                <tr key={solicitacao.id}>
                                    <td>{'#' + solicitacao.id}</td>
                                    <td>{dataHoraMaskBR(solicitacao.data)}</td>
                                    <td>{'# ' + solicitacao.pedido.id}</td>
                                    <td>{statusMask(solicitacao.status)}</td>
                                    <td>{dataHoraMaskBR(solicitacao.dataAtualizacao)}</td>
                                    <td>
                                        <button className={styles.buttonAcoes} onClick={() => abrirPopupInfo(solicitacao)}>. . .</button>
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
        </div>
    );
};

export default TabelaPerfilSolicitacoes;