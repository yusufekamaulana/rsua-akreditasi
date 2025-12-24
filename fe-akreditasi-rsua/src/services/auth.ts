import { http, type APIResponse } from "./http";

export type TokenPair = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  role: "perawat" | "pj" | "mutu" | "admin";
};

type LoginRequest = {
  email: string;
  password: string;
};

type RefreshRequest = {
  refresh_token: string;
};

export async function loginApi(payload: LoginRequest): Promise<TokenPair> {
  const res = await http.post<APIResponse<TokenPair>>(
    "/v1/auth/login",
    payload
  );
  if (!res.data) throw new Error("Login gagal: token tidak ditemukan");
  return res.data;
}

export async function refreshTokenApi(
  payload: RefreshRequest
): Promise<TokenPair> {
  const res = await http.post<APIResponse<TokenPair>>(
    "/v1/auth/refresh",
    payload
  );
  if (!res.data) throw new Error("Refresh token gagal");
  return res.data;
}

export async function logoutApi(): Promise<void> {
  try {
    await http.post<APIResponse<Record<string, unknown>>>(
      "/v1/auth/logout",
      {}
    );
  } catch {
    // ignore
  }
}
