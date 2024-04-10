import React, { useEffect, useState } from "react";
import styles from "./tabelaPerfilPedidos.module.css";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { dataHoraMaskBR, valueMaskBR, statusMask, creditCardXXXXMask, dataMaskBR, cpfMask, telefoneMask } from "../../../utils/mask";
import { useNavigate } from "react-router-dom";

const TabelaPerfilPedidos = (props) => {
    const {pedidos} = props;

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [pedidosPorPagina] = useState(6);

    const [colunaClassificada, setColunaClassificada] = useState(null);
    const [ordemClassificacao, setOrdemClassificacao] = useState('asc');

    const navigate = useNavigate();

    // Abre um modal com os detalhes do pedido usando o SweetAlert2
    const abrirPopupInfo = (pedido) => {
        const detalhesPedido =`
            <div class=${styles.justifyText}>
                <hr>
                <h2>Geral</h2>
                <p><strong>Status:</strong> ${statusMask(pedido.status)}</p>
                <p><strong>Data:</strong> ${dataHoraMaskBR(pedido.data)}</p>
                <p><strong>Data da Última Atualização:</strong> ${dataHoraMaskBR(pedido.dataAtualizacao)}</p>
                <p><strong>Valor Total:</strong> R$ ${valueMaskBR(pedido.valorTotal)}</p>
                <p><strong>Frete:</strong> R$ ${valueMaskBR(pedido.frete)}</p>
                <hr>
                <h2>Carrinho de Compras</h2>
                <p><strong>Código:</strong> #${pedido.carrinhoCompra.id}</p>
                <p><strong>Valor Carrinho:</strong> R$ ${valueMaskBR(pedido.carrinhoCompra.valorCarrinho)}</p>
                <p><strong>Peso Total:</strong> ${valueMaskBR(pedido.carrinhoCompra.pesoTotal/1000)} kg</p>
                <hr>
                <h3>Itens do Carrinho:</h3>
                ${pedido.carrinhoCompra.itensCarrinho.map(item => {
                    return `
                        <p><strong>Produto:</strong> ${item.produto.titulo}</p>
                        <p><strong>Quantidade:</strong> ${item.quantidade}</p>
                        <p><strong>Preço Unitário:</strong> R$ ${valueMaskBR(item.produto.preco)}</p>
                        <p><strong>Valor Total do Item:</strong> R$ ${valueMaskBR(item.valorItem)}</p>
                        <br>
                    `;
                }).join("")}
                <hr>
                <h2>Pagamento</h2>
                ${pedido.cartoes.map(cartaoPedido => {
                    return `
                        <p><strong>Cartão:</strong> ${cartaoPedido.cartao.bandeira}, ${creditCardXXXXMask(cartaoPedido.cartao.numeroCartao)}, ${cartaoPedido.cartao.nomeCartao} [${cartaoPedido.cartao.mesVencimento}/${cartaoPedido.cartao.anoVencimento}]</p>
                        <p><strong>Valor Parcial:</strong> R$ ${valueMaskBR(cartaoPedido.valorParcial || 0)}</p>
                        <p><strong>Parcelas:</strong> ${cartaoPedido.parcelas}x R$ ${(valueMaskBR(cartaoPedido.valorParcial / cartaoPedido.parcelas) || 0)}</p>
                        <br>
                    `;
                }).join("")}
                <hr>
                <h2>Entrega</h2>
                <p><strong>Endereço:</strong> ${pedido.enderecoCliente.tipo}, ${pedido.enderecoCliente.apelido}, ${pedido.enderecoCliente.endereco.cep}, ${pedido.enderecoCliente.endereco.rua}, ${pedido.enderecoCliente.numero}, ${pedido.enderecoCliente.endereco.bairro}, ${pedido.enderecoCliente.endereco.cidade} - ${pedido.enderecoCliente.endereco.estado}</p>
                <p><strong>Prazo:</strong> ${pedido.prazoDias + ' Dia(s)'}</p>
                <p><strong>Observação:</strong> ${pedido.enderecoCliente.observacao}</p>
                <hr>
            </div>
        `;

        Swal.fire({
            title: `<h3 style='color:#011640;'>Pedido #${pedido.id}</h3>`,
            html: detalhesPedido,
            showCancelButton: true,
            confirmButtonText: "Alterar Status",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Fechar",
            showDenyButton: true,
            denyButtonText: "Cancelar Pedido",

            width: '40%',
        }).then((result) => {
            if (result.isConfirmed) { // Se o botão "Editar" for clicado
                Swal.fire({
                    title: 'Alterar Status',
                    text: 'Selecione uma opção:',
                    showCancelButton: true,
                    confirmButtonText: "Em Trânsito",
                    confirmButtonColor: "#6085FF",
                    showDenyButton: true,
                    denyButtonText: "Entregue",
                    denyButtonColor: "#011640",
                    cancelButtonText: "Personalizado",
                    cancelButtonColor: "#2D314D",
                    icon: 'info',
                    
                }).then((result) => {
                    if (result.isConfirmed) {
                        despacharPedido(pedido.id);
                    } 
                    else if (result.isDenied) {
                        confirmarEntrega(pedido.id);
                    }
                    else if (result.isDismissed) {
                        abrirPopupUpdateStatus(pedido);
                    }
                });
            } 
            else if (result.isDenied) { // Se o botão "Deletar" for clicado
                abrirPopupCancel(pedido);
            }
        });
    };

    // Função para atualizar o status pedido para EM_TRANSITO
    const despacharPedido = async (pedidoId) => {
        try {
            const token = getToken();
            const response = await fetch(`http://localhost:8080/admin/pedidos/despachar/${pedidoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
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
            console.error("Erro ao atualizar status pedido:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao despachar o pedido.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
        }
    };

    // Função para atualizar o status pedido para ENTREGUE
    const confirmarEntrega = async (pedidoId) => {
        try {
            const token = getToken();
            const response = await fetch(`http://localhost:8080/admin/pedidos/confirmarentrega/${pedidoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
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
            console.error("Erro ao atualizar status pedido:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao confirmar entrega do pedido.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
        }
    };

    // Função para atualizar status pedido
    const abrirPopupUpdateStatus = (pedido) => {
        const statusPedidoOptions = `
            <option value="EM_PROCESSAMENTO">Em Processamento</option>
            <option value="PAGAMENTO_APROVADO">Pagamento Aprovado</option>
            <option value="PAGAMENTO_REPROVADO">Pagamento Reprovado</option>
            <option value="EM_TRANSITO">Em Trânsito</option>
            <option value="ENTREGUE">Entregue</option>
            <option value="TROCA_SOLICITADA">Troca Solicitada</option>
            <option value="TROCA_APROVADA">Troca Aprovada</option>
            <option value="TROCA_REPROVADA">Troca Reprovada</option>
            <option value="PRODUTOS_TROCA_RECEBIDOS">Produtos Troca Recebidos</option>
            <option value="TROCA_FINALIZADA">Troca Finalizada</option>
            <option value="TROCA_CANCELADA">Troca Cancelada</option>
            <option value="CANCELADO">Cancelado</option>
        `;
    
        Swal.fire({
            title: 'Atualizar Status do Pedido',
            html: `Selecione o novo status do pedido:<br>
                <select id="novoStatus" class="swal2-select">${statusPedidoOptions}</select>`,
            showCancelButton: true,
            confirmButtonText: "Atualizar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                const novoStatus = Swal.getPopup().querySelector('#novoStatus').value;
    
                // Chamando a função para atualizar o status do pedido
                atualizarStatusPedido(pedido.id, novoStatus);
            }
        }).then((result) => {
            if (result.isDismissed) { // Se o usuário clicar em cancelar, volte para abrirPopupInfo
                abrirPopupInfo(pedido);
            }
        });
    };

    const atualizarStatusPedido = async (pedidoId, novoStatus) => {
        try {
            const token = getToken();
            const response = await fetch(`http://localhost:8080/admin/pedidos/update/${pedidoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    statusPedido: novoStatus
                }),
            });
    
            if (response.ok) {
                const successMessage = await response.text();
                Swal.fire({ title: "Sucesso!", html: `${successMessage}`, icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            } else {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Erro ao atualizar status do pedido:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao atualizar o status do pedido.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
        }
    };

    // Função para solicitar confirmação da deleção do pedido
    const abrirPopupCancel = (pedido) => {
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
                    cancelarPedido(pedido.id);
                }
                else if (result.isDismissed) {
                    abrirPopupInfo(pedido);
                }
            });
    };

    // Função para deletar um pedido
    const cancelarPedido = async (pedidoId) => {
        try {
            const token = getToken();

            const response = await fetch(`http://localhost:8080/perfil/cancel/pedido/${pedidoId}`, {
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
            console.error("Erro ao deletar pedido:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao cancelar o pedido.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
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

    const indexUltimoPedido = paginaAtual * pedidosPorPagina;
    const indexPrimeiroPedido = indexUltimoPedido - pedidosPorPagina;

    // Condicionais para ordenar os pedidos com base na coluna selecionada
    const sortedPedidos = [...pedidos].sort((a, b) => {
        if (colunaClassificada === 'ID') {
            return ordemClassificacao === 'asc' ? a.id - b.id : b.id - a.id;
        } 
        else if (colunaClassificada === 'Data') {
            return ordemClassificacao === 'asc' ? new Date(a.data) - new Date(b.data) : new Date(b.data) - new Date(a.data);
        } 
        else if (colunaClassificada === 'Valor Total') {
            return ordemClassificacao === 'asc' ? a.valorTotal - b.valorTotal : b.valorTotal - a.valorTotal;
        } 
        else if (colunaClassificada === 'Status') {
            return ordemClassificacao === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
        }
        else if (colunaClassificada === 'Data Atualizacao') {
            return ordemClassificacao === 'asc' ? new Date(a.dataAtualizacao) - new Date(b.dataAtualizacao) : new Date(b.dataAtualizacao) - new Date(a.dataAtualizacao);
        } 
        return 0;
    });

    const pedidosAtuais = sortedPedidos.slice(indexPrimeiroPedido, indexUltimoPedido);
    const totalPaginas = Math.ceil(pedidos.length / pedidosPorPagina);

    const handlePaginaAnterior = () => {
        setPaginaAtual(paginaAnterior => Math.max(paginaAnterior - 1, 1));
    };

    const handleProximaPagina = () => {
        setPaginaAtual(paginaAnterior => Math.min(paginaAnterior + 1, totalPaginas));
    };

    return (
        <div className={styles.container}>
            {console.log(pedidos)}
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
                            <th onClick={() => handleSort('Valor Total')}>
                                Valor Total
                                {colunaClassificada === 'Valor Total' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Status')}>
                                Status
                                {colunaClassificada === 'Status' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Data Atualizacao')}>
                                Data Atualização
                                {colunaClassificada === 'Data Atualizacao' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th>Detalhes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosAtuais.map(pedido => (
                            <tr key={pedido.id}>
                                <td>{'#' + pedido.id}</td>
                                <td>{dataHoraMaskBR(pedido.data)}</td>
                                <td>{'R$ ' + valueMaskBR(pedido.valorTotal)}</td>
                                <td>{statusMask(pedido.status)}</td>
                                <td>{dataHoraMaskBR(pedido.dataAtualizacao)}</td>
                                <td>
                                    <button className={styles.buttonAcoes} onClick={() => abrirPopupInfo(pedido)}>. . .</button>
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

export default TabelaPerfilPedidos;