// Resumo.js
import React, { useState, useEffect } from "react";
import style from "./ResumoCheckout.module.css";
import cuponsData from "../../../utils/cupons.json";
import { valueMaskBR } from "../../../utils/mask";

const ResumoCheckout = (props) => {
    const [inputValue, setInputValue] = useState("");
    const [cupons, setProducts] = useState([]);

    useEffect(() => {
        setProducts(cuponsData);
    }, []);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const [discount, setDiscount] = useState("");

    const verificaCupom = (codeToCheck) => {
        return cupons.some((cupom) => cupom.code === codeToCheck);
    };

    const aplicaDesconto = (code) => {
        if (verificaCupom(code)) {
            const cupomEncontrado = cupons.find((cupom) => cupom.code === code);
            if (cupomEncontrado) {
                setDiscount(cupomEncontrado.discount);
            } else {
                window.alert(`Cupom ${cupons} encontrado, mas inválido`);
            }
        } else {
            window.alert(`Cupom ${cupons} não encontrado ou inválido`);
        }
    };

    return (
        <>
            <div className={style.resumo}>
                <h1>Resumo</h1>
                <p>Valor: R${valueMaskBR(props.valorCarrinho)}</p>
                <p>Frete: R${valueMaskBR(props.frete)}</p>
                <p>Desconto: R${(discount)}</p>
                <p>Total: R${valueMaskBR(props.valorCarrinho + props.frete - discount)}</p>
                <button className={style.btn}>Pagamento</button>
                <button className={style.btn}>
                    <a className={style.link} href="/">
                        Continuar comprando
                    </a>
                </button>
            </div>
            <div className={style.cupom}>
                <h1>Desconto</h1>
                <input
                    className={style.inputTextCupom}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Código do cupom"
                />
                <button className={style.btn} onClick={() => aplicaDesconto(inputValue)}>
                    Aplicar cupom
                </button>
            </div>
        </>
    );
};

export default ResumoCheckout;
