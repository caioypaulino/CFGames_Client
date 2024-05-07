import Swal from "sweetalert2";
import { getToken, limparToken } from "../../utils/storage";
import { dataMaskBR, dataMaskEN, dataMaskEN2 } from "../../utils/mask";

async function carregarProdutosCategorias(setProdutos, setCategorias, navigate) {
    const token = getToken();

    try {
        const responseProdutos = await fetch('http://localhost:8080/admin/produtos', {
            headers: { Authorization: "Bearer " + token }
        });

        const responseCategorias = await fetch('http://localhost:8080/admin/categorias', {
            headers: { Authorization: "Bearer " + token }
        });

        if (responseProdutos.ok && responseCategorias.ok) {
            const jsonProdutos = await responseProdutos.json();
            const jsonCategorias = await responseCategorias.json();

            const sortedProdutos = jsonProdutos.sort((a, b) => a.id - b.id); // Ordena os produtos por ID

            setProdutos(sortedProdutos);
            setCategorias(jsonCategorias); // Definindo categorias
        }
        else {
            if (responseProdutos.status === 500 || responseCategorias.status === 500) {
                throw new Error('Token Inválido!');
            }
            else if (responseProdutos.status === 400 || responseCategorias.status === 400) {
                Swal.fire({ title: "Erro!", html: `Erro ao carregar produtos ou categorias!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            }
            else if (responseProdutos.status === 403 || responseCategorias.status === 403) {
                Swal.fire({ title: "Erro!", html: `Você não possui permissão para acessar o painel de administrador.<br><br> Por favor, entre em contato com o administrador do sistema para mais informações.`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/perfil/pessoal"); });
            }
        }
    }
    catch (error) {
        limparToken();
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar painel de administrador.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

async function buscarProdutos(navigate) {
    const token = getToken();

    try {
        const responseProdutos = await fetch('http://localhost:8080/admin/produtos', {
            headers: { Authorization: "Bearer " + token }
        });

        if (responseProdutos.ok) {
            const jsonProdutos = await responseProdutos.json();

            const sortedProdutos = jsonProdutos.sort((a, b) => a.id - b.id); // Ordena os produtos por ID

            return sortedProdutos;
        }
        else {
            if (responseProdutos.status === 500) {
                throw new Error('Token Inválido!');
            }
            else if (responseProdutos.status === 400) {
                Swal.fire({ title: "Erro!", html: `Erro ao carregar produtos ou categorias!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            }
            else if (responseProdutos.status === 403) {
                Swal.fire({ title: "Erro!", html: `Você não possui permissão para acessar o painel de administrador.<br><br> Por favor, entre em contato com o administrador do sistema para mais informações.`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/perfil/pessoal"); });
            }
        }
    }
    catch (error) {
        limparToken();
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar painel de administrador.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

// Função para adicionar o produto
async function adicionarProduto ({
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
    quantidade, 
    preco, 
    status, 
    categorias
}) {
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

// Função para atualizar o produto
async function atualizarProduto ({
    produtoId, 
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
}) {
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

async function atualizarEstoque (produtoId, quantidade) {
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
    } 
    catch (error) {
        console.error("Erro ao atualizar estoque:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao atualizar o estoque.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
    }
};

// Função para deletar um produto
async function deletarProduto (produtoId) {
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

async function filtrarProdutos(produtos, filtro) {
    // Lógica para filtrar os produtos com base nos filtros
    const produtosFiltrados = produtos.filter(produto => {
        // Verifica se o produto match ao range de valores selecionados
        const matchPreco = produto.preco >= parseFloat(filtro.precoMin) && produto.preco <= parseFloat(filtro.precoMax);

        // Verifica se o produto match às categorias selecionadas
        const filtroCategorias = filtro.categorias && filtro.categorias.length > 0;
        const matchCategorias = filtroCategorias ? filtro.categorias.some(catId => produto.categorias.map(cat => cat.id).includes(catId)) : true;

        // Verifica se o produto match às plataformas selecionadas
        const filtroPlataformas = filtro.plataformas && filtro.plataformas.length > 0;
        const matchPlataformas = filtroPlataformas ? filtro.plataformas.includes(produto.plataforma) : true;

        // Verifica se o produto match aos status selecionados
        const filtroStatus = filtro.status && filtro.status.length > 0;
        const matchStatus = filtroStatus ? filtro.status.includes(produto.status) : true;

        // Verificando se a data de nascimento do cliente match ao filtro
        const matchDataLancamento =
            (!filtro.anoLancamento || dataMaskEN2(produto.dataLancamento).startsWith(filtro.anoLancamento)) &&
            (!filtro.mesLancamento || dataMaskEN2(produto.dataLancamento).includes(filtro.mesLancamento)) &&
            (!filtro.diaLancamento || dataMaskEN2(produto.dataLancamento).endsWith(filtro.diaLancamento));

        return (
            produto.id.toString().includes(filtro.id) &&
            produto.titulo.toLowerCase().includes(filtro.titulo.toLowerCase()) &&
            produto.descricao.toLowerCase().includes(filtro.descricao.toLowerCase()) &&
            produto.marca.toLowerCase().includes(filtro.marca.toLowerCase()) &&
            produto.publisher.toLowerCase().includes(filtro.publisher.toLowerCase()) &&
            produto.codigoBarras.includes(filtro.codigoBarras) &&
            produto.quantidade.toString().includes(filtro.quantidade) &&
            produto.peso.toString().includes(filtro.peso) &&
            produto.comprimento.toString().includes(filtro.comprimento) &&
            produto.largura.toString().includes(filtro.largura) &&
            produto.altura.toString().includes(filtro.altura) &&
            matchPreco &&
            matchDataLancamento &&
            matchCategorias && // Verifica se match aos filtros de categorias
            matchPlataformas && // Verifica se match aos filtros de plataformas
            matchStatus // Verifica se match aos filtros de status
        );
    });

    return produtosFiltrados;
}

const AdminProdutoService = {
    carregarProdutosCategorias,
    buscarProdutos,
    adicionarProduto,
    atualizarProduto,
    atualizarEstoque,
    deletarProduto,
    filtrarProdutos
}

export default AdminProdutoService;