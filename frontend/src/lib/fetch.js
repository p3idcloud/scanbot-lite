import axios from "axios";
import Cookies from "js-cookie";
import { authConstants } from "constants/auth";
import { cookies } from "next/headers";

const isBrowser = () => typeof window !== 'undefined';

export default async function(...args) {
  let token;

  if (isBrowser()) {
    token = localStorage?.getItem('token') || Cookies.get(authConstants.SESSION_TOKEN);
  } else {
    token = Cookies.get(authConstants.SESSION_TOKEN);
  }

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(...args, { headers });
  const result = await res.json();

  if (res.status !== 200) {
    throw new Error(result.error);
  }
  return result;
}

export async function fetchApp({url, requestOptions}) {
  const token = Cookies.get(authConstants.SESSION_TOKEN);
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...requestOptions, headers });

  if (res.status !== 200) {
    throw new Error(await res.text());
  }
  
  const result = await res.json();
  return result;
}

export async function fetchData(url, args = {}, sessionToken = null) {
  let token;
  const Axios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    timeout: 60000,
    cancelToken: args?.source?.token,
  });

  Axios.interceptors.request.use(
    async (config) => {
      if (isBrowser()) {
        token = localStorage?.getItem('token') || Cookies.get(authConstants.SESSION_TOKEN);
      } else if (sessionToken != null && sessionToken != undefined) {
        token = sessionToken
      } else {
        token = Cookies.get(authConstants.SESSION_TOKEN);
      } 

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  try {
    const data = args.body ? args.body : args.data;

    const response = await Axios({
      url,
      method: args.method || 'GET',
      data: data,  // Pass the formData here
      headers: args.headers,  // Pass additional headers if needed
      params: args.params,
      responseType: args.responseType,
      ...args
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error.response ? error.response.data : error);
  }
}

export async function fetchDataSWR(url, args = {}, sessionToken = null) {
  let token;
  const Axios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    timeout: 60000,
    cancelToken: args?.source?.token,
  });

  Axios.interceptors.request.use(
    async (config) => {
      if (isBrowser()) {
        token = localStorage?.getItem('token') || Cookies.get(authConstants.SESSION_TOKEN);
      } else if (sessionToken != null && sessionToken != undefined) {
        token = sessionToken
      } else {
        token = Cookies.get(authConstants.SESSION_TOKEN);
      } 

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  try {
    const data = args.body ? args.body : args.data;

    const response = await Axios({
      url,
      method: args.method || 'GET',
      data: data,  // Pass the formData here
      headers: args.headers,  // Pass additional headers if needed
      params: args.params,
      responseType: args.responseType,
      ...args
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error.response ? error.response.data : error);
  }
}