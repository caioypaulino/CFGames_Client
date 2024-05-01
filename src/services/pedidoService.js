import Swal from "sweetalert2";
import { getToken, limparToken } from "../utils/storage";
import EnderecoService from "./enderecoService";
import CartaoService from "./cartaoService";

async function buscarPedidos (navigate) {
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
        limparToken();
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar pedidos.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

// função para adicionar um novo cartão
async function adicionarPedido ({
    enderecoEntrega, 
    cartoesSelecionados, 
    cuponsSelecionados, 
    valorParcialEditado, 
    valorParcialPorCartao, 
    parcelasPorCartao, 
    carregarEnderecosCliente, 
    enderecoAdicionado, 
    cartoesAdicionados, 
    navigate
}) {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:8080/pedido/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                enderecoCliente: {
                    id: enderecoEntrega.value
                },
                cupons: cuponsSelecionados.map(cupomSelecionado => {
                    const cupomObj = {
                        codigoCupom: cupomSelecionado ? cupomSelecionado.value : ''
                    };

                    return cupomObj;
                }),
                cartoes: cartoesSelecionados.map(cartaoSelecionado => {
                    const cartaoObj = {
                        cartao: {
                            numeroCartao: cartaoSelecionado ? cartaoSelecionado.value : ''
                        },
                        parcelas: parcelasPorCartao[cartaoSelecionado.value] || 1
                    };

                    // Adiciona valorParcial somente se valorParcialEditado for verdadeiro
                    if (valorParcialEditado) {
                        cartaoObj.valorParcial = valorParcialPorCartao[cartaoSelecionado.value] || 0;
                    }

                    return cartaoObj;
                })
            }),
        });

        if (response.ok) {
            if (!enderecoAdicionado.salvar && enderecoAdicionado.id) {
                EnderecoService.excluirEnderecoCheckout(enderecoAdicionado.id, carregarEnderecosCliente);
            }

            if (cartoesAdicionados.length > 0) {
                CartaoService.excluirCartoes(cartoesAdicionados);
            }

            const successMessage = await response.text();

            Swal.fire({ title: "Sucesso!", html: `${successMessage}`, icon: "success", confirmButtonColor: "#6085FF" }).then(() => { navigate('/perfil/pedidos'); });
        }
        else {
            // buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        // tratando mensagem de erro
        console.error("Erro ao adicionar pedido:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar o pedido.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};

// Função para cancelar um pedido
async function cancelarPedido (pedidoId) {
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

const PedidoService = {
    buscarPedidos,
    adicionarPedido,
    cancelarPedido
}

export default PedidoService;