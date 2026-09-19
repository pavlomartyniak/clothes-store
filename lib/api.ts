import { getToken } from "./session";

const API_URL = process.env.API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  init?: RequestInit & { auth?: boolean }
): Promise<T> {
  const { auth = true, headers, ...rest } = init ?? {};
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = await getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    cache: "no-store",
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(", ")
      : (data?.message ?? "Сталася помилка запиту");
    throw new ApiError(res.status, message);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, opts?: RequestInit & { auth?: boolean }) =>
    request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: RequestInit & { auth?: boolean }) =>
    request<T>(path, {
      ...opts,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown, opts?: RequestInit & { auth?: boolean }) =>
    request<T>(path, {
      ...opts,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string, opts?: RequestInit & { auth?: boolean }) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};
