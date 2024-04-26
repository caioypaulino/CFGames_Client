import Swal from "sweetalert2";
import { getToken } from "../utils/storage";

export async function buscarCarrinhoCompras (navigate) {
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
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar carrinho de compras.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

export async function removerItemCarrinho (id) {
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

export async function atualizarQuantidade (itemId, produtoId, quantidade) {
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