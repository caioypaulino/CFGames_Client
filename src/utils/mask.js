// Função para remover máscara e mostrar apenas dígitos
export const removeMask = (value) => {
    value = value.replace(/\D/g,'');
    return value;
}

export const handleCep = (event) => {
    let input = event.target;
    input.value = cepMask(input.value);
}
  
// Função para aplicar máscara ao número de CEP
export const cepMask = (value) => {
    if (!value) return "";

    value = removeMask(value);
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

    number = removeMask(number);
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

export const handleCPF = (event) => {
    let input = event.target;
    input.value = cpfMask(input.value);
}

// Função para aplicar máscara ao número de CPF
export const cpfMask = (value) => {
    if (!value) return "";

    value = removeMask(value);
    value = value.replace(/(\d{3})(\d)/,'$1.$2');
    value = value.replace(/(\d{3})(\d)/,'$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/,'$1-$2');

    return value;
}

export const handleTelefone = (event) => {
    let input = event.target;
    input.value = telefoneMask(input.value);
}

// Função para aplicar máscara ao número de telefone
export const telefoneMask = (value) => {
    if (!value) return "";

    // Remove todos os caracteres não numéricos
    value = value.replace(/\D/g, '');

    // Formatação para número de telefone com 8 ou 9 dígitos
    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    return value;
};

// Função para aplicar máscara de datas (dd/MM/yyyy)
export const dataMaskBR = (value) => {
    const [ano, mes, dia] = value.split("-");
    return `${dia}/${mes}/${ano}`;
}

// Função para aplicar máscara de datas (dd/MM/yyyy)
export const dataMaskBR2 = (value) => {
    const [dia, mes, ano] = value.split("-");
    return `${dia}/${mes}/${ano}`;
}

// Função para aplicar máscara de datas (dd-MM-yyyy)
export const dataMaskEN = (value) => {
    const dataSplit = value.split("-");
    return `${dataSplit[2]}-${dataSplit[1]}-${dataSplit[0]}`;
};

// Função para aplicar máscara de valores (ex: 13950,00 para 13950.00)
export const valueMaskEN = (value) => {

    value = value.replace(",", ".");

    return value;
}

