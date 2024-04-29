import React, { useEffect, useState } from "react";
import styles from "./AdminSolicitacoesTrocaDevolucao.module.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Select from "react-select";
import { getToken } from "../../../utils/storage";
import { dataHoraMaskBR, valueMaskBR, statusMask, dataMaskBR, cpfMask, telefoneMask } from "../../../utils/mask";
import { useNavigate } from "react-router-dom";
import AdminSolicitacaoService from "../../../services/Admin/adminSolicitacaoService";

const AdminSolicitacoesTrocaDevolucao = () => {
    const [solicitacoes, setSolicitacoes] = useState([]);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [solicitacoesPorPagina] = useState(9);

    const [colunaClassificada, setColunaClassificada] = useState(null);
    const [ordemClassificacao, setOrdemClassificacao] = useState('asc');

    const [itensReposicao, setItensReposicao] = useState([]);

    const SwalJSX = withReactContent(Swal);
    const navigate = useNavigate();

    useEffect(() => {
        const carregarSolicitacoes = async () => {
            const response = await AdminSolicitacaoService.buscarSolicitacoes(navigate);

            setSolicitacoes(response);
        }

        carregarSolicitacoes();
    }, []);

    // Função para calcular o valor total dos itens de troca
    const calcularValorTotalItensTroca = (solicitacao) => {
        let valorTotal = 0;

        solicitacao.itensTroca.forEach(itemTroca => {
            valorTotal += itemTroca.itemCarrinho.produto.preco * itemTroca.quantidadeTroca;
        });

        return valorTotal;
    };

    // Função para calcular o peso total dos itens de troca
    const calcularPesoTotalItensTroca = (solicitacao) => {
        let pesoTotal = 0;

        solicitacao.itensTroca.forEach(itemTroca => {
            pesoTotal += itemTroca.itemCarrinho.produto.peso * itemTroca.quantidadeTroca;
        });

        return pesoTotal;
    };

    // Abre um modal com os detalhes da solicitação usando o SweetAlert2
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
                <h2>Cliente</h2>
                <p><strong>ID:</strong> ${solicitacao.cliente.id}</p>
                <p><strong>Nome:</strong> ${solicitacao.cliente.nome}</p>
                <p><strong>CPF:</strong> ${cpfMask(solicitacao.cliente.cpf)}</p>
                <p><strong>Email:</strong> ${solicitacao.cliente.email}</p>
                <p><strong>Data de Nascimento:</strong> ${dataMaskBR(solicitacao.cliente.dataNascimento)}</p>
                <p><strong>Telefone:</strong> ${telefoneMask(solicitacao.cliente.telefone)}</p>
                <hr>
                <h2>Pedido</h2>
                <p><strong>ID:</strong> ${solicitacao.pedido.id}</p>
                <p><strong>Carrinho de Compra ID:</strong> ${solicitacao.pedido.carrinhoCompra.id}</p>
                <p><strong>Valor Total:</strong> R$ ${valueMaskBR(solicitacao.pedido.valorTotal)}</p>
                <p><strong>Valor Carrinho:</strong> R$ ${valueMaskBR(solicitacao.pedido.carrinhoCompra.valorCarrinho)}</p>
                <p><strong>Status:</strong> ${statusMask(solicitacao.pedido.status)}</p>
                
                <hr>
                <h2>Itens Solicitação</h2>
                <p><strong>Valor Total:</strong> R$ ${valueMaskBR(calcularValorTotalItensTroca(solicitacao))}</p>
                <p><strong>Peso Total:</strong> ${valueMaskBR(calcularPesoTotalItensTroca(solicitacao) / 1000)} kg</p>
                <hr>
                <h3>Itens:</h3>
                ${solicitacao.itensTroca.sort((a, b) => a.id - b.id).map(item => {
            return `
                        <p><strong>ID:</strong> ${item.id}</p>
                        <p><strong>Item Carrinho ID:</strong> ${item.itemCarrinho.id}</p>
                        <p><strong>Produto (ID ${item.itemCarrinho.produto.id}):</strong> ${item.itemCarrinho.produto.titulo}</p>
                        <p><strong>Quantidade Pedido:</strong> ${item.itemCarrinho.quantidade}</p>
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
                        <button onClick={() => AdminSolicitacaoService.aprovarSolicitacao(solicitacao.id)} className="swal2-confirm swal2-styled" style={{ backgroundColor: '#6085FF', fontSize: '1rem' }}>Aprovar</button>
                        <button onClick={() => abrirPopupConcluirSolicitacao(solicitacao)} className="swal2-deny swal2-styled" style={{ backgroundColor: '#011640', fontSize: '1rem' }}>Concluir</button>
                        <button onClick={() => AdminSolicitacaoService.reprovarSolicitacao(solicitacao.id)} className="swal2-cancel swal2-styled" style={{ backgroundColor: '#FF0000', fontSize: '1rem' }}>Reprovar</button>
                        <button onClick={() => abrirPopupUpdateStatus(solicitacao)} className="swal2-cancel swal2-styled" style={{ backgroundColor: '#2D314D', fontSize: '1rem' }}>Personalizado</button>
                        <button onClick={() => abrirPopupInfo(solicitacao)} className="swal2-cancel swal2-styled" style={{ backgroundColor: '#6E7881', fontSize: '1rem' }}>Voltar</button>
                    </div>
                );

                SwalJSX.fire({
                    title: 'Alterar Status',
                    html: <FormUpdateStatus />,
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
                abrirPopupDelete(solicitacao);
            }
        });
    };

    // Função para atualizar status solicitação
    const abrirPopupConcluirSolicitacao = (solicitacao) => {
        if (solicitacao.status === "APROVADA" || solicitacao.status === "PRODUTOS_RECEBIDOS") {
            // Preenche itensReposicao ao abrirPopup
            setItensReposicao(solicitacao.itensTroca.map((item) => ({
                itemTroca: { id: item.id },
                quantidadeReposicao: item.quantidadeTroca, // Inicializa a quantidade da solicitação
            })));

            // Definindo quantidades por ItemReposicao
            const getOpcoesQuantidadeReposicao = (quantidade) => {
                const opcoes = [];

                for (let i = 1; i <= quantidade; i++) {
                    opcoes.push({ value: i, label: `${i}` });
                }

                return opcoes;
            };

            const handleQuantidadeReposicaoChange = (itemTrocaId, quantidadeSelecionada) => {
                setItensReposicao((prevState) => {
                    // Verifica se já existe um item com o ID igual ao itemTrocaId
                    const itemIndex = prevState.findIndex((item) => item.itemTroca.id === itemTrocaId);

                    const novoItem = [...prevState];
                    novoItem[itemIndex].quantidadeReposicao = quantidadeSelecionada.value;

                    return novoItem;
                });
            };

            const DetalhesConfirmacao = () => (
                <div className={styles.justifyText}>
                    <hr />
                    <h2>Confirmar Recebimento:</h2>
                    {solicitacao.itensTroca.sort((a, b) => a.id - b.id).map(item => (
                        <div key={item.id}>
                            <br />
                            <p><strong>Item Solicitação ID:</strong> {item.id}</p>
                            <p><strong>Item Carrinho ID:</strong> {item.itemCarrinho.id}</p>
                            <p><strong>Produto (ID {item.itemCarrinho.produto.id}):</strong> {item.itemCarrinho.produto.titulo}</p>
                            <p><strong>Quantidade Pedido:</strong> {item.itemCarrinho.quantidade}</p>
                            <p><strong>Quantidade Solicitação:</strong> {item.quantidadeTroca}</p>
                            <p><strong>Preço Unitário:</strong> R$ {valueMaskBR(item.itemCarrinho.produto.preco)}</p>
                            <p><strong>Valor Parcial da Solicitação:</strong> R$ {valueMaskBR(item.itemCarrinho.produto.preco * item.quantidadeTroca)}</p>
                            <br />
                            <div className={styles.quantidadeSelect}>
                                <p><strong>Quantidade para Reposição:</strong></p>
                                <Select
                                    id="quantidadeItens"
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                        }),
                                        option: (provided) => ({
                                            ...provided,
                                            fontSize: "1rem",
                                        }),
                                    }}
                                    options={getOpcoesQuantidadeReposicao(item.quantidadeTroca)}
                                    placeholder="Selecione a quantidade"
                                    defaultValue={{ value: item.quantidadeTroca, label: `${item.quantidadeTroca}` }}
                                    onChange={(quantidadeSelecionada) => { handleQuantidadeReposicaoChange(item.id, quantidadeSelecionada) }}
                                />
                            </div>
                            <hr />
                        </div>
                    ))}
                    <h4>
                        Repor Itens no Estoque:{" "}
                        <input type="checkbox" id="reporEstoque" />
                    </h4>
                </div>
            );

            SwalJSX.fire({
                title: `<h3 style='color:#011640;'>Concluir Solicitação Troca/Devolução #${solicitacao.id}</h3>`,
                html: <DetalhesConfirmacao />,
                showCancelButton: true,
                confirmButtonText: "Concluir",
                confirmButtonColor: "#6085FF",
                cancelButtonText: "Cancelar",
                icon: "warning",
                width: "40%",
                preConfirm: () => {
                    const reporEstoque = document.getElementById('reporEstoque').checked;

                    // Chamando a função para atualizar o status da solicitação
                    AdminSolicitacaoService.concluirSolicitacao(solicitacao.id, itensReposicao, reporEstoque);
                }
            }).then((result) => {
                if (result.isDismissed) { // Se o usuário clicar em cancelar, volte para abrirPopupInfo
                    abrirPopupInfo(solicitacao);
                }
            });
        }
        else if (solicitacao.status === "CONCLUIDA") {
            Swal.fire({ title: "Conclusão Inválida!", html: `Não é possível concluir a solicitação.<br></br>(Solicitação já foi Concluída)`, icon: "warning", confirmButtonColor: "#6085FF" });
        }
        else if (solicitacao.status === "CANCELADA") {
            Swal.fire({ title: "Conclusão Inválida!", html: `Não é possível concluir a solicitação.<br></br>(Solicitação Cancelada)`, icon: "warning", confirmButtonColor: "#6085FF" });
        }
        else if (solicitacao.status !== "CONCLUIDA") {
            Swal.fire({ title: "Conclusão Inválida!", html: `Não é possível concluir a solicitação.<br></br>(Solicitação ainda não foi aprovada ou itens ainda não foram recebidos)`, icon: "warning", confirmButtonColor: "#6085FF" });
        }
    };



    // Função para atualizar status solicitação
    const abrirPopupUpdateStatus = (solicitacao) => {
        const statusSolicitacaoOptions = `
            <option value="PENDENTE">Pendente</option>
            <option value="APROVADA">Aprovada</option>
            <option value="REPROVADA">Reprovada</option>
            <option value="PRODUTOS_RECEBIDOS">Produtos Recebidos</option>
            <option value="CANCELADA">Cancelada</option>
        `;

        Swal.fire({
            title: 'Atualizar Status da Solicitação',
            html: `Selecione o novo status:<br>
                <select id="novoStatus" class="swal2-select">${statusSolicitacaoOptions}</select>`,
            showCancelButton: true,
            confirmButtonText: "Atualizar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                const novoStatus = Swal.getPopup().querySelector('#novoStatus').value;

                // Chamando a função para atualizar o status do pedido
                AdminSolicitacaoService.atualizarStatusSolicitacao(solicitacao.id, novoStatus);
            }
        }).then((result) => {
            if (result.isDismissed) { // Se o usuário clicar em cancelar, volte para abrirPopupInfo
                abrirPopupInfo(solicitacao);
            }
        });
    };

    // Função para solicitar confirmação da deleção da solicitação de troca/devolução
    const abrirPopupDelete = (solicitacao) => {
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
                AdminSolicitacaoService.deletarSolicitacao(solicitacao.id);
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
        else if (colunaClassificada === 'Cliente ID') {
            return ordemClassificacao === 'asc' ? a.cliente.id - b.cliente.id : b.cliente.id - a.cliente.id;
        }
        else if (colunaClassificada === 'Pedido ID') {
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
                            <th onClick={() => handleSort('Data')}>
                                Data
                                {colunaClassificada === 'Data' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Cliente ID')}>
                                Cliente ID
                                {colunaClassificada === 'Cliente ID' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Pedido ID')}>
                                Pedido ID
                                {colunaClassificada === 'Pedido ID' && (
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
                        {solicitacoesAtuais.map(solicitacao => (
                            <tr key={solicitacao.id}>
                                <td>{solicitacao.id}</td>
                                <td>{dataHoraMaskBR(solicitacao.data)}</td>
                                <td>{solicitacao.cliente.id}</td>
                                <td>{solicitacao.pedido.id}</td>
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
    );
};

export default AdminSolicitacoesTrocaDevolucao;