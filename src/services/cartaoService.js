import Swal from "sweetalert2";
import { getToken } from "../utils/storage";

export async function buscarCartoes (navigate) {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:8080/perfil/cartoes', {
            headers: { Authorization: "Bearer " + token }
        });

        if (!response.ok) {
            throw new Error('Token Inválido!');
        }

        return await response.json();
    }
    catch (error) {
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar cartões.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

// função para adicionar um novo cartão
export async function adicionarCartao (numeroCartao, nomeCartao, mesVencimento, anoVencimento, cvc) {
    try {
        const token = getToken();
        const response = await fetch("http://localhost:8080/perfil/add/cartao", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                numeroCartao,
                nomeCartao,
                mesVencimento,
                anoVencimento,
                cvc,
            }),
        });

        if (response.ok) {
            Swal.fire({ title: "Sucesso!", text: "Cartão adicionado com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
        }
        else {
            // buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        // tratando mensagem de erro
        console.error("Erro ao adicionar cartão:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar o cartão.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};

// Função para excluir o cartão
export async function excluirCartao (numeroCartao) {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:8080/perfil/remove/cartao", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                numeroCartao,
            }),
        });

        if (response.ok) {
            // Exibindo mensagem de sucesso
            Swal.fire({ title: "Removido!", text: "Cartão foi removido com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
        }
        else {
            // Buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        // Tratando mensagem de erro
        console.error("Erro ao excluir cartão:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao excluir o cartão.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};