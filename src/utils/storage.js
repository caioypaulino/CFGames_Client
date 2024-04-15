import cupomList from "./cupons.json"

// storage cupons
export const salvarNoCupons = () => {
  localStorage.setItem("cupons", JSON.stringify(cupomList));
};
export const getCupom = () => {
  return JSON.parse(localStorage.getItem("cupons")) || [];
};

// storage Token
export const salvarToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token")
};