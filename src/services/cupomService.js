import Swal from "sweetalert2";
import { getToken } from "../utils/storage";
import { DateMask } from "../utils/mask";

async function buscarCupons (navigate) {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:8080/perfil/cupons', {
            headers: { Authorization: "Bearer " + token }
        });

        if (!response.ok) {
            throw new Error('Token Inválido!');
        }

        const cupons = await response.json();

        // Filtrando apenas os cupons disponíveis e com validade após o dia atual
        const cuponsDisponiveis = cupons.filter(cupom => {
            return cupom.disponivel === true && DateMask(cupom.validade) >= new Date();
        });

        // Ordenando os cupons pela maior valor de desconto
        cuponsDisponiveis.sort((cupom1, cupom2) => {
            return cupom2.valorDesconto - cupom1.valorDesconto;
        });

        // Ordenando os cupons pela menor data de validade
        cuponsDisponiveis.sort((cupom1, cupom2) => {
            return DateMask(cupom1.validade) - DateMask(cupom2.validade);
        });

        return cuponsDisponiveis;
    }
    catch (error) {
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar cupons.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

const CupomService = {
    buscarCupons
}

export default CupomService;