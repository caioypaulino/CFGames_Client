import Swal from "sweetalert2";
import { getToken } from "../utils/storage";

export async function buscarPedidos (navigate) {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:8080/perfil/pedidos', {
            headers: { Authorization: "Bearer " + token }
        });

        if (response.ok) {
            const json = await response.json()
            const sortedPedidos = json.sort((a, b) => b.id - a.id); // Ordena os pedidos por ID

            return sortedPedidos;
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
        Swal.fire({ title: "Erro!", html: `Erro ao carregar pedidos.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

// Função para cancelar um pedido
export async function cancelarPedido (pedidoId) {
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
        console.error("Erro ao cancelar pedido:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao cancelar o pedido.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};