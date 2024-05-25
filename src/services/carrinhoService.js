import Swal from "sweetalert2";
import { getToken, limparToken } from "../utils/storage";

async function buscarCarrinhoCompras (navigate) {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:8080/carrinhodecompra/read', {
            headers: { Authorization: "Bearer " + token }
        });

        if (response.ok) {
            return await response.json();
        }
        else {
            if (response.status === 500) {
                throw new Error('Token Inválido!');
            }
            else if (response.status === 400) {
                return [];
            }
        }
    }
    catch (error) {
        limparToken();
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar carrinho de compras.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

async function buscarCarrinhoComprasCheckout (navigate) {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:8080/carrinhodecompra/read', {
            headers: { Authorization: "Bearer " + token }
        });

        if (response.ok) {
            const carrinho = await response.json();

            if (carrinho.valorCarrinho > 0){
                return carrinho;
            }
            else {
                Swal.fire({ title: "Erro!", html: `Não é possível finalizar a compra<br><br>Carrinho de compras vazio!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/carrinho"); });
            }
        }
        else {
            if (response.status === 500) {
                throw new Error('Token Inválido!');
            }
            else if (response.status === 400) {
                Swal.fire({ title: "Erro!", html: `Não é possível finalizar a compra<br><br>Carrinho de compras vazio!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/carrinho"); });
            }
        }
    }
    catch (error) {
        limparToken();
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar carrinho de compras.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

// função para adicionar um carrinho de compras
async function adicionarCarrinho (produto, quantidadeSelecionada, navigate) {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:8080/carrinhodecompra/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                itensCarrinho: [
                    {
                        produto: {
                            id: produto.id
                        },
                        quantidade: quantidadeSelecionada
                    }
                ]
            }),
        });

        if (response.ok) {
            Swal.fire({ title: "Sucesso!", text: "Item(ns) adicionado(s) com sucesso ao carrinho de compras.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
        }
        else {
            adicionarItemCarrinho(produto, quantidadeSelecionada);
        }
    }
    catch (error) {
        limparToken();
        console.error("Erro ao adicionar item:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar item(ns) ao carrinho de compras.<br><br>Faça login novamente!<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

async function adicionarItemCarrinho (produto, quantidadeSelecionada) {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:8080/carrinhodecompra/add/itemcarrinho", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                produto: {
                    id: produto.id
                },
                quantidade: quantidadeSelecionada
            }),
        });

        if (response.ok) {
            Swal.fire({ title: "Sucesso!", text: "Item(ns) adicionado(s) com sucesso ao carrinho de compras.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
        }
        else {
            // buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        limparToken();
        console.error("Erro ao adicionar item:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar item(ns) ao carrinho de compras.<br><br>Faça login novamente!<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};

async function atualizarQuantidade (itemId, produtoId, quantidade) {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:8080/carrinhodecompra/update', {
            method: 'PUT',
            headers: {
                'Authorization': "Bearer " + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itemCarrinhoId: itemId,
                produtoId,
                quantidade
            })
        });

        if (response.ok) {
            window.location.reload();
        }
        else {
            console.error('Erro ao atualizar quantidade:', response.status);
            Swal.fire({ title: "Erro!", html: `Erro ao atualizar quantidade.<br><br>Quantidade Indisponível em Estoque`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
        }
    }
    catch (error) {
        console.error('Erro ao atualizar quantidade:', error);
    }
}

async function removerItemCarrinho (id) {
    const token = getToken();

    try {
        const response = await fetch(`http://localhost:8080/carrinhodecompra/remove/itemcarrinho/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': "Bearer " + token
            }
        });

        if (response.ok) {
            Swal.fire({ title: "Removido!", text: "Item removido com sucesso do carrinho.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
        }
        else {
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        console.error("Erro ao remover item:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao remover item do carrinho.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
    }
}

// Função para excluir o cartão
async function excluirCarrinho () {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:8080/carrinhodecompra/delete", {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + token,
            }
        });

        if (response.ok) {
            // Exibindo mensagem de sucesso
            Swal.fire({ title: "Removido!", text: "Carrinho de Compras removido com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            // Recarregar a página ou atualizar os dados, conforme necessário
        }
        else {
            // Buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        // Tratando mensagem de erro
        console.error("Erro ao excluir carrinho:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao excluir o Carrinho de Compras.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};

const CarrinhoService = {
    buscarCarrinhoCompras,
    buscarCarrinhoComprasCheckout,
    adicionarCarrinho,
    adicionarItemCarrinho,
    atualizarQuantidade, 
    removerItemCarrinho,
    excluirCarrinho
}

export default CarrinhoService;