"use server";

import { redirect } from "next/navigation";
import { clearToken, setToken } from "../session";

export type LoginState = { error?: string } | undefined;

const API_URL = process.env.API_URL ?? "http://localhost:4000/api";

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(", ")
      : (data?.message ?? "Не вдалося увійти");
    return { error: message };
  }

  await setToken(data.accessToken);
  redirect("/");
}

export async function logoutAction() {
  await clearToken();
  redirect("/login");
}
