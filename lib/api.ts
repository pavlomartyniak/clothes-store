import axios, { AxiosError } from "axios";
import { getToken } from "./session";

const API_URL = process.env.API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Server-only axios client for the NestJS backend. Used exclusively from
 * Route Handlers under app/api/* (the BFF layer) and from the login Server
 * Action — never imported by Client Components, since that's where the
 * admin JWT (read here from an httpOnly cookie) is attached.
 */
const http = axios.create({ baseURL: API_URL });

http.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function toApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    const message = Array.isArray(data?.message)
      ? data.message.join(", ")
      : (data?.message ?? "Сталася помилка запиту");
    return new ApiError(error.response?.status ?? 500, message);
  }
  return new ApiError(500, "Сталася помилка запиту");
}

async function request<T>(
  method: "get" | "post" | "patch" | "delete",
  path: string,
  body?: unknown
): Promise<T> {
  try {
    const res = await http.request<T>({ method, url: path, data: body });
    return res.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export const api = {
  get: <T>(path: string) => request<T>("get", path),
  post: <T>(path: string, body?: unknown) => request<T>("post", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("patch", path, body),
  delete: <T>(path: string) => request<T>("delete", path),
};
