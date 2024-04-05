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
                <p>Frete: R${props.frete !== undefined && parseFloat(props.frete) || '0.00'}</p>
                <p>Prazo: {props.prazo !== undefined && props.prazo + ' Dia(s)'|| 'Indefinido'}</p>
                <p>Desconto: R${(discount !== undefined && discount || '0.00')}</p><br></br>
                <p>Total: R${valueMaskBR(props.frete !== undefined && (props.valorCarrinho + parseFloat(props.frete) - discount) || props.valorCarrinho)}</p>
                <button className={style.btn}>Confirmar Pedido</button>
                <button className={style.btnContinuar}><a className={style.link} href="/carrinho">Voltar ao Carrinho</a></button>
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
                <button className={style.btnCupom} onClick={() => aplicaDesconto(inputValue)}>Aplicar cupom</button>
            </div>
        </>
    );
};

export default ResumoCheckout;
