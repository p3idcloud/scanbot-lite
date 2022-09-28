import axios from "axios";
import { parseCookies } from "nookies";
import { authConstants } from "constants/auth";

export default async function(...args) {
  const token = localStorage?.getItem('token') ||  parseCookies()[authConstants.SESSION_TOKEN];
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

export async function fetchApp({url , ctx, requestOptions}) {
  const token = parseCookies(ctx)[authConstants.SESSION_TOKEN];
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

export async function fetchData(...args) {
  const Axios = axios.create({
    baseURL: process.env.BACKEND_URL,
    timeout: 20000,
  });
  Axios.interceptors.request.use(
    async (config) => {
      const token = localStorage?.getItem("token") || parseCookies()[authConstants.SESSION_TOKEN];
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
    null,
    { synchronous: true }
  );

  try {
    const fetcher = await Axios(...args);
    return fetcher.data;
  } catch (error) {
    return Promise.reject(error);
  }
}
