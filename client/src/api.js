import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:6969/api",
  withCredentials: false,
});

export default API;
