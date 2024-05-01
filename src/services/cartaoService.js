import Swal from "sweetalert2";
import { getToken, limparToken } from "../utils/storage";

async function buscarCartoes (navigate) {
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
        limparToken();
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar cartões.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

// função para adicionar um novo cartão
async function adicionarCartao (numeroCartao, nomeCartao, mesVencimento, anoVencimento, cvc) {
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

async function adicionarCartaoCheckout ({
    numeroCartao, 
    nomeCartao, 
    mesVencimento, 
    anoVencimento, 
    cvc, 
    salvarNoPerfil, 
    cartoesAdicionados,
    setCartoesAdicionados, 
    carregarCartoesCliente
}) {
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
            const novoCartaoNumero = await response.json();

            Swal.fire({ title: "Sucesso!", text: "Cartão adicionado com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => {
                const novoCartao = { numeroCartao: novoCartaoNumero, salvar: salvarNoPerfil }
                setCartoesAdicionados([...cartoesAdicionados, novoCartao]);
                carregarCartoesCliente();
            });
        }
        else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    }
    catch (error) {
        console.error("Erro ao adicionar cartão:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar o cartão.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};

// Função para excluir o cartão
async function excluirCartao (numeroCartao) {
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

// função request delete cartoes
async function excluirCartoes (cartoesAdicionados) {
    try {
        const token = getToken();

        const cartoesParaExcluir = cartoesAdicionados
            .filter(cartao => !cartao.salvar && cartao.numeroCartao)
            .map(cartao => ({ numeroCartao: cartao.numeroCartao }));

        const response = await fetch("http://localhost:8080/perfil/remove/cartoes", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(cartoesParaExcluir),
        });

        if (response.ok) {

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
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao excluir o cartão.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
    }
};

const CartaoService = {
    buscarCartoes,
    adicionarCartao,
    adicionarCartaoCheckout,
    excluirCartao,
    excluirCartoes    
}

export default CartaoService;