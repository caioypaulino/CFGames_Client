import Swal from "sweetalert2";
import { getToken } from "../../utils/storage";

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

const AdminProdutoService = {
    carregarProdutosCategorias,
    adicionarProduto,
    atualizarProduto,
    atualizarEstoque,
    deletarProduto
}

export default AdminProdutoService;