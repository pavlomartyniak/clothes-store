import axios, { AxiosError } from "axios";

const API_URL = process.env.API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Server-side client (used from Server Components / route handlers). Axios
// requests aren't intercepted by Next.js's fetch cache, so responses are
// always fresh — equivalent to the old `{ cache: "no-store" }` fetch option.
const http = axios.create({ baseURL: API_URL });

function toApiError(error: unknown, fallback: string): ApiError {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    const message = Array.isArray(data?.message)
      ? data.message.join(", ")
      : (data?.message ?? fallback);
    return new ApiError(error.response?.status ?? 500, message);
  }
  return new ApiError(500, fallback);
}

export async function apiGet<T>(path: string): Promise<T> {
  try {
    const res = await http.get<T>(path);
    return res.data;
  } catch (error) {
    throw toApiError(error, `Не вдалося завантажити дані (${path})`);
  }
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  try {
    const res = await http.post<T>(path, body);
    return res.data;
  } catch (error) {
    throw toApiError(error, "Не вдалося виконати запит");
  }
}
