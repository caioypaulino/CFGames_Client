import Swal from "sweetalert2";
import { getToken } from "../../utils/storage";

async function buscarPedidos(navigate) {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:8080/admin/pedidos', {
            headers: { Authorization: "Bearer " + token }
        });

        if (response.ok) {
            const json = await response.json()
            const sortedPedidos = json.sort((a, b) => a.id - b.id); // Ordena os pedidos por ID

            return sortedPedidos;
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

// Função para atualizar o status pedido para EM_TRANSITO
async function despacharPedido(pedidoId) {
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
async function confirmarEntrega(pedidoId) {
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

async function atualizarStatusPedido(pedidoId, novoStatus) {
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
        } 
        else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } 
    catch (error) {
        console.error("Erro ao atualizar status do pedido:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao atualizar o status do pedido.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
    }
};

// Função para deletar um pedido
async function deletarPedido(pedidoId) {
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

const AdminPedidoService = {
    buscarPedidos,
    despacharPedido,
    confirmarEntrega,
    atualizarStatusPedido,
    deletarPedido
}

export default AdminPedidoService;