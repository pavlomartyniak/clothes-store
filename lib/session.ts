import { cookies } from "next/headers";

const TOKEN_COOKIE = "siluet_admin_token";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days, matches backend JWT expiry

export async function getToken() {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value;
}

export async function setToken(token: string) {
  const store = await cookies();
  store.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearToken() {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
}

export const SESSION_COOKIE_NAME = TOKEN_COOKIE;
