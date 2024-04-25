import React, { useState, useEffect } from "react";
import styles from "./ResumoCheckout.module.css";
import Swal from "sweetalert2";
import { valueMaskBR } from "../../../utils/mask";
import CartoesCheckout from "../cartoes_checkout";
import CuponsCheckout from "../cupons_checkout";
import { getToken } from "../../../utils/storage";
import { useNavigate } from "react-router-dom";

const ResumoCheckout = (props) => {
    const { valorCarrinho, frete, prazo, enderecoEntrega, enderecoAdicionado, excluirEndereco } = props;

    const [desconto, setDesconto] = useState(0);
    const [troco, setTroco] = useState(0);
    const [valorTotal, setValorTotal] = useState(0);

    const [cartoesSelecionados, setCartoesSelecionados] = useState([]);
    const [valorParcialPorCartao, setValorParcialPorCartao] = useState({});
    const [parcelasPorCartao, setParcelasPorCartao] = useState({});
    const [valorParcialEditado, setValorParcialEditado] = useState(false);
    const [cartoesAdicionados, setCartoesAdicionados] = useState([]);

    const [cuponsSelecionados, setCuponsSelecionados] = useState([]);

    const navigate = useNavigate();

    // Atualizando o valor total sempre que houver mudanças nos valores do carrinho, frete ou desconto
    useEffect(() => {
        const total = valorCarrinho + parseFloat(frete || 0) - desconto;

        if (total < 0) {
            setValorTotal(0);
            setTroco(total * (-1));
        }
        else {
            setValorTotal(total);
            setTroco(0);
        }
    }, [valorCarrinho, frete, desconto]);

    useEffect(() => {
        if (cuponsSelecionados.length > 0) {
            let descontoTotal = 0;

            cuponsSelecionados.forEach(cupom => {
                descontoTotal += cupom.desconto;
            });

            setDesconto(descontoTotal);
        }
        else {
            setDesconto(0);
        }
    }, [cuponsSelecionados, desconto]);

    useEffect(() => {
        if (cartoesSelecionados.length > 0 && valorTotal <= 0) {
            setCartoesSelecionados([]);
        }
    }, [cuponsSelecionados, cartoesSelecionados, valorTotal]);

    useEffect(() => {
        // Verificando se algum cupom tem desconto maior que o necessário
        const cuponsComDescontoMaiorQueTotal = cuponsSelecionados.filter(cupom => cupom.desconto > (valorCarrinho + parseFloat(frete || 0)));

        // Se houver cupons com desconto maior que o necessário e lista diferente, atualize a lista de cupons selecionados
        if (cuponsComDescontoMaiorQueTotal.length > 0 && JSON.stringify(cuponsComDescontoMaiorQueTotal) !== JSON.stringify(cuponsSelecionados)) {
            setCuponsSelecionados(cuponsComDescontoMaiorQueTotal);
        }
    }, [cuponsSelecionados, valorCarrinho, frete]);

    const abrirPopupConfirmarPedido = () => {
        // Verificando se o endereço de entrega foi selecionado
        if (!enderecoEntrega) {
            return Swal.fire({ title: 'Erro!', text: 'Por favor, selecione um endereço de entrega.', icon: 'error', confirmButtonColor: "#6085FF", });// Return para evitar a abertura do popup de confirmação
        }

        // Verificando se pelo menos um cartão ou cupom foi selecionado
        if (cuponsSelecionados.length === 0 && cartoesSelecionados.length === 0) {
            return Swal.fire({ title: 'Erro!', text: 'Por favor, selecione ao menos um método de pagamento.', icon: 'error', confirmButtonColor: "#6085FF", });
        }

        const minValorParcial = cartoesSelecionados.some(cartaoSelecionado => valorParcialPorCartao[cartaoSelecionado.value] < 10);

        // Verificando se valor parcial é menor do que R$ 10,00
        if (cuponsSelecionados.length === 0 && minValorParcial) {
            return Swal.fire({ title: 'Erro!', text: 'Valor parcial mínimo por cartão é R$ 10,00.', icon: 'error', confirmButtonColor: "#6085FF", });
        }

        if (cuponsSelecionados.length > 0 && minValorParcial && cartoesSelecionados.length > 1) {
            return Swal.fire({ title: 'Erro!', text: 'Valor parcial mínimo por cartão é R$ 10,00.', icon: 'error', confirmButtonColor: "#6085FF", });
        }

        if (cuponsSelecionados.length > 0 && minValorParcial && valorTotal >= 10 && cartoesSelecionados.length > 0) {
            return Swal.fire({ title: 'Erro!', text: 'Valor parcial mínimo por cartão é R$ 10,00.', icon: 'error', confirmButtonColor: "#6085FF", });
        }

        // Verificando se o valor do pagamento é suficiente
        if (valorTotal > 0 && cartoesSelecionados.length === 0) {
            return Swal.fire({ title: 'Erro!', html: 'Por favor, selecione um método de pagamento.<br><br>Pagamento insuficiente!', icon: 'error', confirmButtonColor: "#6085FF", });
        }

        const detalhesPedido = `
            <div class=${styles.justifyText}>
                <hr>
                <h2>Detalhes</h2>
                <p><strong>Valor Total:</strong> R$ ${valueMaskBR(valorCarrinho + parseFloat(frete) || 0)}</p>
                <p><strong>Valor Carrinho:</strong> R$ ${valueMaskBR(valorCarrinho)}</p>
                <p><strong>Frete:</strong> R$ ${valueMaskBR(parseFloat(frete) || 0)}</p>
                <br>
                <p><strong>Desconto:</strong> R$ ${valueMaskBR(desconto || 0)}</p>
                <p><strong>Desconto Utilizado:</strong> R$ ${valueMaskBR(desconto - troco || 0)}</p>
                <p><strong>Troco:</strong> R$ ${valueMaskBR(troco || 0)}</p>
                <br>
                <p><strong>Valor Final:</strong> R$ ${valueMaskBR(valorTotal)}</p>
                <br>
                <hr>
                <h2>Pagamento</h2>
                ${cuponsSelecionados && cuponsSelecionados.map(cupom => {
            return `
                    <p><strong>Cupom:</strong> ${cupom.value}</p>
                    <p><strong>Desconto Cupom:</strong> R$ ${valueMaskBR(cupom.desconto || 0)}</p>
                `;
        }).join("<br>")}
                <br>
                ${cartoesSelecionados && cartoesSelecionados.map(cartao => {
            const valorParcial = valorParcialPorCartao[cartao.value];
            const parcelas = parcelasPorCartao[cartao.value];

            return `
                    <p><strong>Cartão:</strong> ${cartao.label}</p>
                    <p><strong>Valor Parcial:</strong> R$ ${valueMaskBR(valorParcial || 0)}</p>
                    <p><strong>Parcelas:</strong> ${parcelas}x R$ ${(valueMaskBR(valorParcial / parcelas) || 0)}</p>
                `;
        }).join("<br>")}
                <hr>
                <h2>Entrega</h2>
                <p><strong>Endereço:</strong> ${(enderecoEntrega && enderecoEntrega.label)}</p>
                <p><strong>Prazo:</strong> ${enderecoEntrega !== undefined && prazo + ' Dia(s)' || 'Indefinido'}</p>
                <br>
                <hr>
                <font face="Roboto" size="1px"><strong>No caso de sobrar troco, um cupom será gerado automaticamente para compras futuras.</strong></font>
            </div>
        `;

        Swal.fire({
            title: "<h3 style='color:#011640;'>Deseja Finalizar o Pedido?</h3>",
            html: detalhesPedido,
            confirmButtonText: 'Confirmar',
            confirmButtonColor: "#6085FF",
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            showCloseButton: true,
            icon: 'warning',
            width: '40%',
            preConfirm: () => {
                adicionarPedido(enderecoEntrega, cartoesSelecionados, valorParcialPorCartao, parcelasPorCartao);
            },
        });
    };

    // função para adicionar um novo cartão
    const adicionarPedido = async (enderecoEntrega, cartoesSelecionados, valorParcialPorCartao, parcelasPorCartao) => {
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
                    excluirEndereco(enderecoAdicionado.id);
                }

                if (cartoesAdicionados.length > 0) {
                    excluirCartoes(cartoesAdicionados);
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

    // função request delete cartao
    const excluirCartoes = async (cartoesAdicionados) => {
        // fazer um foreach para cartoes adicionados
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

    return (
        <>
            <div className={styles.resumo}>
                <h1>Resumo</h1>
                <p>Valor Carrinho: R$ {valueMaskBR(valorCarrinho)}</p>
                <p>Frete: R$ {frete !== undefined && parseFloat(frete) || '0.00'}</p>
                <p>Prazo de Entrega: {prazo !== undefined && prazo + ' Dia(s)' || 'Indefinido'}</p>
                <p>Desconto: R$ {(desconto !== undefined && valueMaskBR(desconto) || '0.00')}</p>
                <p>Troco: R$ {(troco !== undefined && valueMaskBR(troco) || '0.00')}</p><br></br>
                <p>Total: R$ {valueMaskBR(valorTotal)}</p>
                <button className={styles.btn} onClick={abrirPopupConfirmarPedido}>Confirmar Pedido</button>
                <button className={styles.btnContinuar}><a className={styles.link} href="/carrinho">Voltar ao Carrinho</a></button>
            </div>
            <div className={styles.pagamento}>
                <CartoesCheckout
                    valorTotal={valorTotal}
                    cartoesPedido={[cartoesSelecionados, setCartoesSelecionados]} // passando como props
                    valorParcialPedido={[valorParcialPorCartao, setValorParcialPorCartao]}
                    valorParcialEdit={[valorParcialEditado, setValorParcialEditado]}
                    parcelasPedido={[parcelasPorCartao, setParcelasPorCartao]}
                    cartoesAdded={[cartoesAdicionados, setCartoesAdicionados]}
                    excluirCartoes={excluirCartoes}
                />
            </div>
            <div className={styles.pagamento}>
                <CuponsCheckout
                    valorTotal={valorTotal}
                    cuponsPedido={[cuponsSelecionados, setCuponsSelecionados]} // passando como props
                />
            </div><br></br>
        </>
    );
};

export default ResumoCheckout;
