// storage Token
export const salvarToken = (token) => {
    localStorage.setItem("token", token);
};

export const limparToken = () => {
    localStorage.setItem("token", "")
};

export const getToken = () => {
    return localStorage.getItem("token")
};