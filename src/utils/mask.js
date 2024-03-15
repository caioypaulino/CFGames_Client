export const handleCep = (event) => {
    let input = event.target;
    input.value = cepMask(input.value);
}
  
// Função para aplicar máscara ao número de CEP
export const cepMask = (value) => {
    if (!value) return "";

    value = value.replace(/\D/g,'');
    value = value.replace(/(\d{5})(\d)/,'$1-$2');

    return value;
}

export const handleCreditCard = (event) => {
    let input = event.target;
    input.value = creditCardMask(input.value);
}

// Função para aplicar máscara de espaços ao número do cartão
export const creditCardMask = (number) => {
    // Colocar espaço a cada 4 dígitos
    if (!number) return "";

    number = number.replace(/\D/g,'');
    number = number.replace(/(\d{4})(?=\d)/g, '$1 ');

    return number;
}

// Função para aplicar máscara censura ao número do cartão
export const creditCardXXXXMask = (number) => {
    // Substituir todos os dígitos, exceto os últimos 4, por "X"
    const visibleDigits = number.slice(-4);
    const maskedDigits = number.slice(0, -4).replace(/\d/g, 'X');

    const maskedNumberWithSpaces = maskedDigits.replace(/(.{4})/g, '$1 ');

    return maskedNumberWithSpaces + visibleDigits;
}