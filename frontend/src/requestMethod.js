import axios from "axios";
import { BASE_URL } from "../config";

export const BASE_URL = "http://localhost:5000/api";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const privateRequest = axios.create({
  baseURL: BASE_URL,
});
privateRequest.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"));

    config.headers["Token"] = "Bearer " + token;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
