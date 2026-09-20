"use client";

import axios, { AxiosError } from "axios";

/**
 * Client-side axios instance. Points at this Next.js app's own /api routes
 * (the BFF layer under app/api/*), never at the NestJS backend directly —
 * those route handlers read the admin's httpOnly JWT cookie server-side and
 * forward it, so the token never has to reach client-side JavaScript.
 */
export const http = axios.create({ baseURL: "/api" });

export function extractErrorMessage(error: unknown, fallback = "Сталася помилка"): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
  }
  return fallback;
}
