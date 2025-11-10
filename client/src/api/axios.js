import axios from "axios";

const API = axios.create({
  // Aise dhyan rkhna A.C.T.O.R

  // A -> Address (base address)
  baseURL: "/api",

  // C -> Common headers
  headers: {

    // T -> Type of Content
    "Content-Type": "Application/json",

    // O -> Auth -> token of bearer
    "Authorization": `Bearer ${localStorage.getItem('token')}`,  // token injection is done..

    // Rest headers are not of our use
  }
});

export default API;