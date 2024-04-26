import Swal from "sweetalert2";
import { getToken } from "../utils/storage";


async function buscarCarrinhoCompras(navigate) {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:8080/carrinhodecompra/read', {
            headers: { Authorization: "Bearer " + token }
        });

        if (response.ok) {
            const carrinho = await response.json();

            if (carrinho.itensCarrinho.length === 0) {
                Swal.fire({ title: "Erro!", html: `Erro ao carregar carrinho de compras.<br><br>Carrinho de Compras Vazio!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/carrinho"); });
            }
            else {
                return carrinho;
            }
        }
        else {
            if (response.status === 500) {
                throw new Error('Token Inválido!');
            }
            else if (response.status === 400) {
                Swal.fire({ title: "Erro!", html: `Erro ao carregar carrinho de compras.<br><br>Carrinho de Compras Vazio!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/carrinho"); });
            }
        }
    }
    catch (error) {
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar carrinho de compras.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

const CheckoutService = {
    buscarCarrinhoCompras
};

export default CheckoutService;