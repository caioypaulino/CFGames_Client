import React, { useEffect, useState } from "react";
import iconAdd from "../../../assets/buttons/add.svg";
import styles from "./AdminProdutos.module.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Select from "react-select";
import { getToken } from "../../../utils/storage";
import { dataMaskBR2, dataMaskEN, dataMaskEN2, valueMaskEN } from "../../../utils/mask";

const AdminProdutos = () => {
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    // Multi-Select react-select array
    let categoriasSelecionadas = [];
    const OnChangeCategorias = (categoriasSelecionadasNovas) => {
        categoriasSelecionadas = categoriasSelecionadasNovas;
    };

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [produtosPorPagina] = useState(9);

    const [colunaClassificada, setColunaClassificada] = useState(null);
    const [ordemClassificacao, setOrdemClassificacao] = useState('asc');
    
    const SwalJSX = withReactContent(Swal)

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

        fetch('http://localhost:8080/admin/categorias', {
            headers: { Authorization: "Bearer " + token }
        })
            .then(resp => resp.json())
            .then(json => {
                setCategorias(json); // Definindo categorias
            });
    }, []);

    // Abre um modal com os detalhes do produto usando o SweetAlert2
    const abrirPopupInfo = (produto) => {
        let nomesCategorias = produto.categorias.map(categoria => categoria.nome);
        
        Swal.fire({
            title: produto.titulo,
            html: `
                <p>ID: ${produto.id}</p>
                <p>Categoria(s): ${produto.categorias.length > 0 ? nomesCategorias : ''}</p>
                <p>Preço: ${produto.preco}</p>
                <p>Quantidade: ${produto.quantidade}</p>
                <p>Descrição: ${produto.descricao}</p>
                <p>Plataforma: ${produto.plataforma}</p>
                <p>Data de Lançamento: ${dataMaskBR2(produto.dataLancamento)}</p>
                <p>Marca: ${produto.marca}</p>
                <p>Editora: ${produto.publisher}</p>
                <p>Peso: ${produto.peso + 'g'}</p>
                <p>Dimensões (C x L x A): ${produto.comprimento}cm x ${produto.largura}cm x ${produto.altura}cm</p>
                <p>Código de Barras: ${produto.codigoBarras}</p>
                <p>Status: ${produto.status}</p>
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
                        abrirPopupUpdate(produto);
                    } 
                    else if (result.isDenied) {
                        abrirPopupEstoque(produto);
                    }
                });
            } 
            else if (result.isDenied) { // Se o botão "Deletar" for clicado
                abrirPopupDelete(produto);
            }
        });
    };
    
    // Função para abrir o modal de atualização do produto
    const abrirPopupUpdate = (produto) => {
        console.log(produto);

        const FormUpdateProduto = () => (
            <form>
                <input id="titulo" type="text" className="swal2-input" placeholder="Título" defaultValue={produto.titulo} />
                <input id="descricao" type="text" className="swal2-input" placeholder="Descrição" defaultValue={produto.descricao} />
                <select id="plataforma" className="swal2-input" style={{marginTop: '1rem', padding: '0.5rem', fontSize: '1.25rem', border: '1px solid #ccc', borderRadius: '4px', width: '16.3rem', height: '3.5rem', fontFamily: 'inherit', outline: 'none'}} onFocus={(e) => e.target.style.borderColor = '#b1cae3'} onBlur={(e) => e.target.style.borderColor = '#ccc'}>
                    <option defaultValue={produto.plataforma} selected disabled hidden>{produto.plataforma}</option>
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
                <input id="dataLancamento" type="date" className="swal2-input" placeholder="Data de Lançamento" defaultValue={dataMaskEN2(produto.dataLancamento)} style={{width: '16.3rem'}}/>
                <input id="marca" type="text" className="swal2-input" placeholder="Marca" defaultValue={produto.marca} />
                <input id="publisher" type="text" className="swal2-input" placeholder="Publisher" defaultValue={produto.publisher} />
                <input id="peso" type="number" className="swal2-input" placeholder="Peso (em gramas)" defaultValue={produto.peso} />
                <input id="comprimento" type="number" className="swal2-input" placeholder="Comprimento (cm)" min="0" step="0.1" defaultValue={produto.comprimento} />
                <input id="altura" type="number" className="swal2-input" placeholder="Altura (cm)" min="0" step="0.1" defaultValue={produto.altura} />
                <input id="largura" type="number" className="swal2-input" placeholder="Largura (cm)" min="0" step="0.1" defaultValue={produto.largura} />
                <input id="codigoBarras" type="text" className="swal2-input" placeholder="Código de Barras" defaultValue={produto.codigoBarras} />
                <input id="preco" type="number" className="swal2-input" placeholder="Preço" min="10.0" step="0.01" defaultValue={produto.preco} />
                <select id="status" className="swal2-select" style={{marginTop: '1rem', padding: '0.5rem', fontSize: '1.25rem', border: '1px solid #ccc', borderRadius: '4px', width: '16.3rem', height: '3.5rem', fontFamily: 'inherit', outline: 'none'}} defaultValue={produto.status} onFocus={(e) => e.target.style.borderColor = '#b1cae3'} onBlur={(e) => e.target.style.borderColor = '#ccc'}>
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
                    defaultValue={produto.categorias.map(categoria => ({ value: categoria.id, label: categoria.nome }))}
                    onChange={OnChangeCategorias}
                />
            </form>
        );
    
        SwalJSX.fire({
            title: 'Atualizar Produto',
            html: (
                <FormUpdateProduto />
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
                
                // Chamando a função para atualizar o produto
                atualizarProduto(produto.id, titulo, descricao, plataforma, dataLancamento, marca, publisher, peso, comprimento, altura, largura, codigoBarras, preco, status, categorias);
            }
        }).then((result) => {
            if (result.isDismissed) { // Se o usuário clicar em cancelar, volte para abrirPopupInfo
                abrirPopupInfo(produto); 
            }
        });
    };
    
    // Função para atualizar o produto
    const atualizarProduto = async (produtoId, titulo, descricao, plataforma, dataLancamento, marca, publisher, peso, comprimento, altura, largura, codigoBarras, preco, status, categorias) => {
        try {
            const token = getToken();
            const response = await fetch(`http://localhost:8080/admin/produtos/update/${produtoId}`, {
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
    const abrirPopupEstoque = (produto) => {
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
                atualizarEstoque(produto.id, quantidadeEstoque);
            }
        }).then((result) => {
            if (result.isDismissed) { // Se o usuário clicar em cancelar, volte para abrirPopupInfo
                abrirPopupInfo(produto); 
            }
        });
    };
    
    const atualizarEstoque = async (produtoId, quantidade) => {
        try {
            const token = getToken();
            const response = await fetch(`http://localhost:8080/admin/produtos/update/estoque/produto/${produtoId}`, {
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

    // Função para solicitar confirmação da deleção do produto
    const abrirPopupDelete = (produto) => {
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
                deletarProduto(produto.id);
            }
            else if (result.isDismissed) {
                abrirPopupInfo(produto);
            }
        });
    };

    // Função para deletar um produto
    const deletarProduto = async (produtoId) => {
        try {
            const token = getToken();

            const response = await fetch(`http://localhost:8080/admin/produtos/delete/${produtoId}`, {
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
            console.error("Erro ao deletar produto:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao deletar o produto.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
        }
    };

    const abrirPopupAdd = () => {
        const FormAddProduto = () => (
            <form>
                <input id="titulo" type="text" className="swal2-input" placeholder="Título" />
                <input id="descricao" type="text" className="swal2-input" placeholder="Descrição" />
                <select id="plataforma" className="swal2-input" style={{marginTop: '1rem', padding: '0.5rem', fontSize: '1.25rem', border: '1px solid #ccc', borderRadius: '4px', width: '16.3rem', height: '3.5rem', fontFamily: 'inherit', outline: 'none'}} onFocus={(e) => e.target.style.borderColor = '#b1cae3'} onBlur={(e) => e.target.style.borderColor = '#ccc'}>
                    <option value="" disabled selected hidden>Plataforma</option>
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
                <input id="dataLancamento" type="date" className="swal2-input" placeholder="Data de Lançamento" style={{width: '16.3rem'}} />
                <input id="marca" type="text" className="swal2-input" placeholder="Marca" />
                <input id="publisher" type="text" className="swal2-input" placeholder="Publisher" />
                <input id="comprimento" type="number" className="swal2-input" placeholder="Comprimento (cm)" min="0" />
                <input id="largura" type="number" className="swal2-input" placeholder="Largura (cm)" min="0" />
                <input id="altura" type="number" className="swal2-input" placeholder="Altura (cm)" min="0" />
                <input id="peso" type="number" className="swal2-input" placeholder="Peso (g)" />
                <input id="codigoBarras" type="text" pattern="[0-9]{13}" maxLength="13" className="swal2-input" placeholder="Código de Barras" />
                <input id="quantidade" type="number" min="1" className="swal2-input" placeholder="Quantidade" pattern="[0-9]+" title="Apenas números inteiros" />
                <input id="preco" type="number" className="swal2-input" placeholder="Preço" />
                <select id="status" placeholder="Status" className="swal2-select" style={{marginTop: '1rem', padding: '0.5rem', fontSize: '1.25rem', border: '1px solid #ccc', borderRadius: '4px', width: '16.3rem', height: '3.5rem', fontFamily: 'inherit', outline: 'none'}} onFocus={(e) => e.target.style.borderColor = '#b1cae3'} onBlur={(e) => e.target.style.borderColor = '#ccc'}>
                    <option value="" disabled selected hidden>Status</option>
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
                    onChange={OnChangeCategorias} 
                />
            </form>
        );

        SwalJSX.fire({
            title: 'Adicionar Produto',
            html:(
                <FormAddProduto />
            ) ,
            showCancelButton: true,
            confirmButtonText: "Adicionar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                const titulo = Swal.getPopup().querySelector('#titulo').value;
                const descricao = Swal.getPopup().querySelector('#descricao').value;
                const plataforma = Swal.getPopup().querySelector('#plataforma').value;
                const dataLancamento = dataMaskEN(Swal.getPopup().querySelector('#dataLancamento').value);
                const marca = Swal.getPopup().querySelector('#marca').value;
                const publisher = Swal.getPopup().querySelector('#publisher').value;
                const comprimento = parseFloat(valueMaskEN(Swal.getPopup().querySelector('#comprimento').value));
                const largura = parseFloat(valueMaskEN(Swal.getPopup().querySelector('#largura').value));
                const altura = parseFloat(valueMaskEN(Swal.getPopup().querySelector('#altura').value));
                const peso = parseFloat(valueMaskEN(Swal.getPopup().querySelector('#peso').value));
                const codigoBarras = Swal.getPopup().querySelector('#codigoBarras').value;
                const quantidade = parseInt(Swal.getPopup().querySelector('#quantidade').value);
                const preco = parseFloat(valueMaskEN(Swal.getPopup().querySelector('#preco').value));
                const status = Swal.getPopup().querySelector('#status').value;
                const categorias = categoriasSelecionadas.map(categoria => ({ id: categoria.value }));
                
                adicionarProduto(titulo, descricao, plataforma, dataLancamento, marca, publisher, peso, comprimento, altura, largura, codigoBarras, quantidade, preco, status, categorias)
            },
        });
    };

    // Função para adicionar o produto
    const adicionarProduto = async (titulo, descricao, plataforma, dataLancamento, marca, publisher, peso, comprimento, altura, largura, codigoBarras, quantidade, preco, status, categorias) => {
        try {
            const token = getToken();
            const response = await fetch("http://localhost:8080/admin/produtos/add", {
                method: "POST",
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
                    comprimento,
                    largura,
                    altura,
                    peso,
                    codigoBarras,
                    quantidade,
                    preco,
                    status,
                    categorias
                }),
            });

            if (response.ok) {
                Swal.fire({ title: "Sucesso!", text: "Produto adicionado com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            }
            else {
                // Buscando mensagem de erro que não é JSON
                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }
        }
        catch (error) {
            // Tratando mensagem de erro
            console.error("Erro ao adicionar produto:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar o produto.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
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
        else if (colunaClassificada === 'Categoria') {
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

    const produtosAtuais = sortedProdutos.slice(indexPrimeiroProduto, indexUltimoProduto);
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
                            <th onClick={() => handleSort('Categoria')}>
                                Categoria
                                {colunaClassificada === 'Categoria' && (
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
                        {produtosAtuais.map(produto => (
                            <tr key={produto.id}>
                                <td>{produto.id}</td>
                                <td>{produto.titulo}</td>
                                <td>{produto.categorias.length > 0 ? produto.categorias[0].nome : ''}</td>
                                <td>{'R$ ' + produto.preco}</td>
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
                <div className={styles.btnIconAdd}>
                    <button className={styles.btnIcon} onClick={abrirPopupAdd}>
                        <img className={styles.iconAdd} src={iconAdd} alt="Adicionar" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProdutos;
