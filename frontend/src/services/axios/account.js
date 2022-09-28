import axios from "./index";
import Router from "next/router";
import { parseCookies } from "nookies";
import { authConstants } from "constants/auth";

axios.interceptors.request.use((request) => {
  const token = localStorage.getItem("token") || parseCookies()[authConstants.SESSION_TOKEN];

  if (token) {
    request.headers["Authorization"] = `Bearer ${token}`;
  }
  request.baseURL = process.env.backendUrl;
  return request;
});

axios.interceptors.response.use((response) => {
  if (response.request.responseURL.endsWith("disabled=1")) {
    return Router.push(response.request.responseURL);
  }
  return response;
});

export const getUserData = ({id}) => axios.get(`/api/accounts/${id}`);

export const updateUserData = ({ id, email, fullname, username }) =>
  axios.patch(`/api/accounts`, { id, email, fullname, username });

export const getProfilePicture = () => axios.get(`/api/accounts/profilePic`);

export const uploadProfilePicture = (profilePicture) => {
  const headers = {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  };
  const formData = new FormData();
  formData.append("upload", profilePicture);
  return axios.post(`/api/accounts/profilePic`, formData, { headers });
};

export const signOutBackend = () =>
  axios.post(`/api/authentication/signin/signout`);
