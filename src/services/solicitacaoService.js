import Swal from "sweetalert2";
import { getToken, limparToken } from "../utils/storage";

async function buscarSolicitacoes (navigate) {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:8080/perfil/solicitacoestroca', {
            headers: { Authorization: "Bearer " + token }
        });

        if (response.ok) {
            const json = await response.json()
            const sortedSolicitacoes = json.sort((a, b) => a.id - b.id); // Ordena os pedidos por ID

            return sortedSolicitacoes;
        }
        else {
            if (response.status === 500) {
                throw new Error('Token Inválido!');
            }
            else if (response.status === 400) {
                Swal.fire({ title: "Erro!", html: `Erro ao carregar solicitações de troca/devolução!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            }
        }
    } 
    catch (error) {
        limparToken();
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar solicitações de troca/devolução.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

async function confirmarSolicitacao( pedido, itensTroca ) {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:8080/perfil/add/solicitacaotroca", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                pedido: {
                    id: pedido.id
                },
                itensTroca: itensTroca.map(item => ({
                    itemCarrinho: {
                        id: item.value
                    },
                    quantidadeTroca: item.quantidadeTroca
                })),
                observacao: document.getElementById("motivo").value
            }),
        });

        if (response.ok) {
            Swal.fire({ title: "Sucesso!", text: "Solicitação de troca/devolução realizada com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
        }
        else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    }
    catch (error) {
        console.error("Erro ao solicitar troca/devolução:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao solicitar troca/devolução.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
    }
}

// Função para cancelar uma solicitação
async function cancelarSolicitacao (solicitacaoId) {
    try {
        const token = getToken();

        const response = await fetch(`http://localhost:8080/perfil/cancel/solicitacaotroca/${solicitacaoId}`, {
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
        console.error("Erro ao cancelar solicitação de troca/devolução:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao cancelar a solicitação de troca/devolução.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};

const SolicitacaoService = {
    buscarSolicitacoes,
    confirmarSolicitacao,
    cancelarSolicitacao
}

export default SolicitacaoService;