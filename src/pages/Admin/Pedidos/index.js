import React, { useEffect, useState } from "react";
import styles from "./AdminPedidos.module.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getToken } from "../../../utils/storage";
import { dataHoraMaskBR, valueMaskBR, statusMask, creditCardXXXXMask, dataMaskBR, cpfMask, telefoneMask } from "../../../utils/mask";
import { useNavigate } from "react-router-dom";

const AdminPedidos = () => {
    const [pedidos, setPedidos] = useState([]);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [pedidosPorPagina] = useState(9);

    const [colunaClassificada, setColunaClassificada] = useState(null);
    const [ordemClassificacao, setOrdemClassificacao] = useState('asc');

    const SwalJSX = withReactContent(Swal);
    const navigate = useNavigate();

    useEffect(() => {
        carregarPedidos();
    }, []);

    const carregarPedidos = async () => {
        const token = getToken();

        try {
            const response = await fetch('http://localhost:8080/admin/pedidos', {
                headers: { Authorization: "Bearer " + token }
            });

            if (response.ok) {
                const json = await response.json()
                const sortedPedidos = json.sort((a, b) => a.id - b.id); // Ordena os pedidos por ID

                setPedidos(sortedPedidos);
            }
            else {
                if (response.status === 500) {
                    throw new Error('Token Inválido!');
                }
                else if (response.status === 400) {
                    Swal.fire({ title: "Erro!", html: `Erro ao carregar pedidos!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
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

    // Abre um modal com os detalhes do pedido usando o SweetAlert2
    const abrirPopupInfo = (pedido) => {
        let descontoTotal = 0;
        let troco = 0;

        if (pedido.cupons.length > 0) {

            pedido.cupons.forEach(cupom => {
                descontoTotal += cupom.valorDesconto;
            });

            if (pedido.valorTotal < descontoTotal) {
                troco =  descontoTotal - pedido.valorTotal;
            }
        }

        const detalhesPedido =`
            <div class=${styles.justifyText}>
                <hr>
                <h2>Geral</h2>
                <p><strong>Valor Total:</strong> R$ ${valueMaskBR(pedido.valorTotal || 0)}</p>
                <p><strong>Frete:</strong> R$ ${valueMaskBR(pedido.frete)}</p>
                <p><strong>Desconto Total:</strong> R$ ${valueMaskBR(descontoTotal || 0)}</p>
                <p><strong>Desconto Utilizado:</strong> R$ ${valueMaskBR(descontoTotal - troco || 0)}</p>
                <p><strong>Troco:</strong> R$ ${valueMaskBR(troco || 0)}</p>
                <p><strong>Valor Final:</strong> R$ ${valueMaskBR(pedido.valorTotal - (descontoTotal - troco) || 0)}</p>
                <br>
                <p><strong>Status:</strong> ${statusMask(pedido.status)}</p>
                <p><strong>Data:</strong> ${dataHoraMaskBR(pedido.data)}</p>
                <p><strong>Data da Última Atualização:</strong> ${dataHoraMaskBR(pedido.dataAtualizacao)}</p>
                <br>
                <hr>
                <h2>Cliente</h2>
                <p><strong>ID:</strong> ${pedido.cliente.id}</p>
                <p><strong>Nome:</strong> ${pedido.cliente.nome}</p>
                <p><strong>CPF:</strong> ${cpfMask(pedido.cliente.cpf)}</p>
                <p><strong>Email:</strong> ${pedido.cliente.email}</p>
                <p><strong>Data de Nascimento:</strong> ${dataMaskBR(pedido.cliente.dataNascimento)}</p>
                <p><strong>Telefone:</strong> ${telefoneMask(pedido.cliente.telefone)}</p>
                <br>
                <hr>
                <h2>Carrinho de Compras</h2>
                <p><strong>ID:</strong> ${pedido.carrinhoCompra.id}</p>
                <p><strong>Valor Carrinho:</strong> R$ ${valueMaskBR(pedido.carrinhoCompra.valorCarrinho)}</p>
                <p><strong>Peso Total:</strong> ${valueMaskBR(pedido.carrinhoCompra.pesoTotal/1000)} kg</p>
                <br>
                <hr>
                <h3>Itens do Carrinho:</h3>
                ${pedido.carrinhoCompra.itensCarrinho.sort((a, b) => a.id - b.id).map(item => {
                    return `
                        <p><strong>ID:</strong> ${item.id}</p>
                        <p><strong>Produto (ID ${item.produto.id}):</strong> ${item.produto.titulo}</p>
                        <p><strong>Quantidade:</strong> ${item.quantidade}</p>
                        <p><strong>Preço Unitário:</strong> R$ ${valueMaskBR(item.produto.preco)}</p>
                        <p><strong>Valor Total do Item:</strong> R$ ${valueMaskBR(item.valorItem)}</p>
                        <br>
                    `;
                }).join("")}
                <hr>
                <h2>Pagamento</h2>
                ${pedido.cupons.map(cupomPedido => {
                    return `
                        <p><strong>Cupom:</strong> ${cupomPedido.codigoCupom}</p>
                        <p><strong>Desconto Cupom:</strong> R$ ${valueMaskBR(cupomPedido.valorDesconto || 0)}</p>
                        <br>
                    `;
                }).join("")}
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
                <p><strong>ID:</strong> ${pedido.enderecoCliente.id}</p>
                <p><strong>Endereço:</strong> ${pedido.enderecoCliente.tipo}, ${pedido.enderecoCliente.apelido}, ${pedido.enderecoCliente.endereco.cep}, ${pedido.enderecoCliente.endereco.rua}, ${pedido.enderecoCliente.numero}, ${pedido.enderecoCliente.endereco.bairro}, ${pedido.enderecoCliente.endereco.cidade} - ${pedido.enderecoCliente.endereco.estado}</p>
                <p><strong>Prazo:</strong> ${pedido.prazoDias + ' Dia(s)'}</p>
                <p><strong>Observação:</strong> ${pedido.enderecoCliente.observacao}</p>
                <br>
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
            denyButtonText: "Deletar",
            width: '40%',
        }).then((result) => {
            if (result.isConfirmed) { // Se o botão "Editar" for clicado
                const FormUpdateStatus = () => (
                    <div>
                        <p>Selecione uma opção:</p>
                        <button onClick={() => despacharPedido(pedido.id)} className="swal2-confirm swal2-styled" style={{ backgroundColor: '#6085FF', fontSize:'1rem' }}>Em Trânsito</button>
                        <button onClick={() => confirmarEntrega(pedido.id)} className="swal2-deny swal2-styled" style={{ backgroundColor: '#011640', fontSize:'1rem' }}>Entregue</button>
                        <button onClick={() => abrirPopupUpdateStatus(pedido)} className="swal2-cancel swal2-styled" style={{ backgroundColor: '#2D314D', fontSize:'1rem' }}>Personalizado</button>
                        <button onClick={() => abrirPopupInfo(pedido)} className="swal2-cancel swal2-styled" style={{ backgroundColor: '#6E7881', fontSize:'1rem' }}>Voltar</button>
                    </div>
                );
                
                SwalJSX.fire({
                    title: 'Alterar Status',
                    text: 'Selecione uma opção:',
                    html: <FormUpdateStatus />,
                    showCancelButton: false,
                    showCloseButton: true,
                    showDenyButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showConfirmButton: false,
                    icon: 'info',
                    width: '35%'
                });
            } 
            else if (result.isDenied) { // Se o botão "Deletar" for clicado
                abrirPopupDelete(pedido);
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
    const abrirPopupDelete = (pedido) => {
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
                    deletarPedido(pedido.id);
                }
                else if (result.isDismissed) {
                    abrirPopupInfo(pedido);
                }
            });
    };

    // Função para deletar um pedido
    const deletarPedido = async (pedidoId) => {
        try {
            const token = getToken();

            const response = await fetch(`http://localhost:8080/admin/pedidos/delete/${pedidoId}`, {
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
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao deletar o pedido.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
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
        else if (colunaClassificada === 'Cliente ID') {
            return ordemClassificacao === 'asc' ? a.cliente.id - b.cliente.id : b.cliente.id - a.cliente.id;
        } 
        else if (colunaClassificada === 'Status') {
            return ordemClassificacao === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
        }
        else if (colunaClassificada === 'Ultima Atualizacao') {
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
        <div className={styles.container}>z
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
                            <th onClick={() => handleSort('Cliente ID')}>
                                Cliente ID
                                {colunaClassificada === 'Cliente ID' && (
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
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosAtuais.map(pedido => (
                            <tr key={pedido.id}>
                                <td>{pedido.id}</td>
                                <td>{dataHoraMaskBR(pedido.data)}</td>
                                <td>{'R$ ' + valueMaskBR(pedido.valorTotal)}</td>
                                <td>{pedido.cliente.id}</td>
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

export default AdminPedidos;