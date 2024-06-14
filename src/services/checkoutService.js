import Swal from "sweetalert2";
import { getToken } from "../utils/storage";

async function calcularFrete (enderecoSelecionado, setFrete, navigate) {
    if (enderecoSelecionado === "") {
        return Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao calcular o frete.<br><br>Nenhum endereço selecionado!`, icon: "error", confirmButtonColor: "#6085FF" })
    }

    try {
        Swal.fire({
            title: `<h3 style='color:#011640; margin-bottom:-1%'>Calculando Frete...</h3>`,
            html: `
                <div>
                    <p>Por favor, aguarde enquanto o sistema calcula o frete.</p>
                </div>
            `,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const token = getToken();

        const response = await fetch("http://localhost:8080/pedido/calcular/frete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                id: enderecoSelecionado.value
            }),
        });

        if (response.ok) {
            Swal.fire({ title: "Sucesso!", text: "Frete calculado com sucesso.", icon: "success", confirmButtonColor: "#6085FF" });
            setFrete(await response.json());
        }
        else {
            // buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        // tratando mensagem de erro
        console.error("Erro ao calcular frete:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao calcular o frete.<br><br>Carrinho de compras vazio!`, icon: "error", confirmButtonColor: "#6085FF" }).then(navigate("/carrinho"));
    }
};

const CheckoutService = {
    calcularFrete
};

export default CheckoutService;