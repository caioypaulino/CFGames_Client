import React, { useEffect, useState } from "react";
import iconAdd from "../../../assets/buttons/add.svg";
import styles from "./AdminPedidos.module.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Select from "react-select";
import { getToken } from "../../../utils/storage";
import { dataMaskBR2, dataMaskEN, dataMaskEN2, dataHoraMaskBR, valueMaskBR } from "../../../utils/mask";
import { useNavigate } from "react-router-dom";

const AdminPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    // Multi-Select react-select array
    let categoriasSelecionadas = [];
    const OnChangeCategorias = (categoriasSelecionadasNovas) => {
        categoriasSelecionadas = categoriasSelecionadasNovas;
    };

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
            }
        }
        catch (error) {
            console.error('Erro ao carregar dados:', error);
            Swal.fire({ title: "Erro!", html: `Erro ao carregar carrinho de compras.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
        }
    };

    // Abre um modal com os detalhes do pedido usando o SweetAlert2
    const abrirPopupInfo = (pedido) => {
        let nomesCategorias = pedido.categorias.map(categoria => categoria.nome);
        
        Swal.fire({
            title: pedido.titulo,
            html: `
                <p>ID: ${pedido.id}</p>
                <p>Categoria(s): ${pedido.categorias.length > 0 ? nomesCategorias : ''}</p>
                <p>Preço: ${pedido.preco}</p>
                <p>Quantidade: ${pedido.quantidade}</p>
                <p>Descrição: ${pedido.descricao}</p>
                <p>Plataforma: ${pedido.plataforma}</p>
                <p>Data de Lançamento: ${dataMaskBR2(pedido.dataLancamento)}</p>
                <p>Marca: ${pedido.marca}</p>
                <p>Editora: ${pedido.publisher}</p>
                <p>Peso: ${pedido.peso + 'g'}</p>
                <p>Dimensões (C x L x A): ${pedido.comprimento}cm x ${pedido.largura}cm x ${pedido.altura}cm</p>
                <p>Código de Barras: ${pedido.codigoBarras}</p>
                <p>Status: ${pedido.status}</p>
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
                Swal.fire({
                    title: 'Editar',
                    text: 'Selecione uma opção:',
                    showCancelButton: true,
                    confirmButtonText: "Produto",
                    confirmButtonColor: "#6085FF",
                    showDenyButton: true,
                    denyButtonText: "Estoque",
                    denyButtonColor: "#011640",
                    cancelButtonText: "Fechar",
                    icon: 'info'
                }).then((result) => {
                    if (result.isConfirmed) {
                        abrirPopupUpdate(pedido);
                    } 
                    else if (result.isDenied) {
                        abrirPopupEstoque(pedido);
                    }
                });
            } 
            else if (result.isDenied) { // Se o botão "Deletar" for clicado
                abrirPopupDelete(pedido);
            }
        });
    };
    
    // Função para abrir o modal de atualização do pedido
    const abrirPopupUpdate = (pedido) => {
        console.log(pedido);

        const FormUpdatePedido = () => (
            <form>
                <input id="titulo" type="text" className="swal2-input" placeholder="Título" defaultValue={pedido.titulo} />
                <input id="descricao" type="text" className="swal2-input" placeholder="Descrição" defaultValue={pedido.descricao} />
                <select id="plataforma" className="swal2-input" style={{marginTop: '1rem', padding: '0.5rem', fontSize: '1.25rem', border: '1px solid #ccc', borderRadius: '4px', width: '16.3rem', height: '3.5rem', fontFamily: 'inherit', outline: 'none'}} onFocus={(e) => e.target.style.borderColor = '#b1cae3'} onBlur={(e) => e.target.style.borderColor = '#ccc'}>
                    <option defaultValue={pedido.plataforma} selected disabled hidden>{pedido.plataforma}</option>
                    <option value="0">XBOX 360</option>
                    <option value="1">XBOX ONE</option>
                    <option value="2">XBOX Series S</option>
                    <option value="3">PlayStation 3</option>
                    <option value="4">PlayStation 4</option>
                    <option value="5">PlayStation 5</option>
                    <option value="6">PSP</option>
                    <option value="7">Nintendo Wii</option>
                    <option value="8">Nintendo DS</option>
                    <option value="9">Nintendo Switch</option>
                </select>
                <input id="dataLancamento" type="date" className="swal2-input" placeholder="Data de Lançamento" defaultValue={dataMaskEN2(pedido.dataLancamento)} style={{width: '16.3rem'}}/>
                <input id="marca" type="text" className="swal2-input" placeholder="Marca" defaultValue={pedido.marca} />
                <input id="publisher" type="text" className="swal2-input" placeholder="Publisher" defaultValue={pedido.publisher} />
                <input id="peso" type="number" className="swal2-input" placeholder="Peso (em gramas)" defaultValue={pedido.peso} />
                <input id="comprimento" type="number" className="swal2-input" placeholder="Comprimento (cm)" min="0" step="0.1" defaultValue={pedido.comprimento} />
                <input id="altura" type="number" className="swal2-input" placeholder="Altura (cm)" min="0" step="0.1" defaultValue={pedido.altura} />
                <input id="largura" type="number" className="swal2-input" placeholder="Largura (cm)" min="0" step="0.1" defaultValue={pedido.largura} />
                <input id="codigoBarras" type="text" className="swal2-input" placeholder="Código de Barras" defaultValue={pedido.codigoBarras} />
                <input id="preco" type="number" className="swal2-input" placeholder="Preço" min="10.0" step="0.01" defaultValue={pedido.preco} />
                <select id="status" className="swal2-select" style={{marginTop: '1rem', padding: '0.5rem', fontSize: '1.25rem', border: '1px solid #ccc', borderRadius: '4px', width: '16.3rem', height: '3.5rem', fontFamily: 'inherit', outline: 'none'}} defaultValue={pedido.status} onFocus={(e) => e.target.style.borderColor = '#b1cae3'} onBlur={(e) => e.target.style.borderColor = '#ccc'}>
                    <option value="" disabled hidden>Status</option>
                    <option value="0">Inativo</option>
                    <option value="1">Ativo</option>
                    <option value="2">Fora de Mercado</option>
                </select>
                <Select
                    id="categorias"
                    class="swal2-select" 
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            width:'16.3rem',
                            marginTop:'1.1rem',
                            marginLeft:'6.01rem'
                        }),
                        menu: (provided) => ({
                            ...provided,
                            width: '16.5rem',
                            marginLeft: '6rem'
                            
                        }),
                        option: (provided) => ({
                            ...provided,
                            fontSize: '1rem',
                        }),
                    }}
                    placeholder="Categorias"
                    options={categorias.map(categoria => ({ value: categoria.id, label: categoria.nome }))}
                    isMulti
                    isClearable
                    isSearchable
                    closeMenuOnSelect={false}
                    defaultValue={pedido.categorias.map(categoria => ({ value: categoria.id, label: categoria.nome }))}
                    onChange={OnChangeCategorias}
                />
            </form>
        );
    
        SwalJSX.fire({
            title: 'Atualizar Pedido',
            html: (
                <FormUpdatePedido />
            ),
            showCancelButton: true,
            confirmButtonText: "Atualizar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                // Obter valores dos campos atualizados
                const titulo = Swal.getPopup().querySelector('#titulo').value;
                const descricao = Swal.getPopup().querySelector('#descricao').value;
                const plataforma = Swal.getPopup().querySelector('#plataforma').value;
                const dataLancamento = dataMaskEN(Swal.getPopup().querySelector('#dataLancamento').value);
                const marca = Swal.getPopup().querySelector('#marca').value;
                const publisher = Swal.getPopup().querySelector('#publisher').value;
                const peso = parseFloat(Swal.getPopup().querySelector('#peso').value);
                const comprimento = parseFloat(Swal.getPopup().querySelector('#comprimento').value);
                const altura = parseFloat(Swal.getPopup().querySelector('#altura').value);
                const largura = parseFloat(Swal.getPopup().querySelector('#largura').value);
                const codigoBarras = Swal.getPopup().querySelector('#codigoBarras').value;
                const preco = parseFloat(Swal.getPopup().querySelector('#preco').value);
                const status = Swal.getPopup().querySelector('#status').value;
                const categorias = categoriasSelecionadas.map(categoria => ({ id: categoria.value }));
                
                // Chamando a função para atualizar o pedido
                atualizarPedido(pedido.id, titulo, descricao, plataforma, dataLancamento, marca, publisher, peso, comprimento, altura, largura, codigoBarras, preco, status, categorias);
            }
        }).then((result) => {
            if (result.isDismissed) { // Se o usuário clicar em cancelar, volte para abrirPopupInfo
                abrirPopupInfo(pedido); 
            }
        });
    };
    
    // Função para atualizar o pedido
    const atualizarPedido = async (pedidoId, titulo, descricao, plataforma, dataLancamento, marca, publisher, peso, comprimento, altura, largura, codigoBarras, preco, status, categorias) => {
        try {
            const token = getToken();
            const response = await fetch(`http://localhost:8080/admin/produtos/update/${pedidoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    titulo, 
                    descricao, 
                    plataforma, 
                    dataLancamento, 
                    marca, 
                    publisher, 
                    peso, 
                    comprimento, 
                    altura, 
                    largura, 
                    codigoBarras, 
                    preco, 
                    status,
                    categorias
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
            console.error("Erro ao atualizar produto:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao atualizar o produto.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
        }
    };

    // Função para solicitar quantidade de estoque do produto (aumentar ou diminuir)
    const abrirPopupEstoque = (pedido) => {
        Swal.fire({
            title: 'Atualizar Estoque',
            html: `Aqui você pode adicionar ou remover itens do estoque.<br>
                <input id="quantidadeEstoque" type="number" class="swal2-input" placeholder="Quantidade">
            `,
            showCancelButton: true,
            confirmButtonText: "Atualizar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                const quantidadeEstoque = parseInt(Swal.getPopup().querySelector('#quantidadeEstoque').value);
    
                // Chamando a função para atualizar o estoque
                atualizarEstoque(pedido.id, quantidadeEstoque);
            }
        }).then((result) => {
            if (result.isDismissed) { // Se o usuário clicar em cancelar, volte para abrirPopupInfo
                abrirPopupInfo(pedido); 
            }
        });
    };
    
    const atualizarEstoque = async (pedidoId, quantidade) => {
        try {
            const token = getToken();
            const response = await fetch(`http://localhost:8080/admin/produtos/update/estoque/produto/${pedidoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    quantidade
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
        } catch (error) {
            console.error("Erro ao atualizar estoque:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao atualizar o estoque.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
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
                            <th onClick={() => handleSort('Prazo')}>
                                Prazo
                                {colunaClassificada === 'Prazo' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Status')}>
                                Status
                                {colunaClassificada === 'Status' && (
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
                                <td>{pedido.prazoDias + ' Dia(s)'}</td>
                                <td>{pedido.status}</td>
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
