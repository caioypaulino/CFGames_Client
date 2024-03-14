export const handleCep = (event) => {
    let input = event.target;
    input.value = cepMask(input.value);
}
  
export const cepMask = (value) => {
    if (!value) return "";

    value = value.replace(/\D/g,'');
    value = value.replace(/(\d{5})(\d)/,'$1-$2');

    return value;
}