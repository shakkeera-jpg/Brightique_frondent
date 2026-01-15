import API from "./axios";

export const registerUser = (data) =>
  API.post("register/", data);

export const loginUser = (data) =>
  API.post("login/", data);
