const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

type HttpMethod = "GET" | "POST" | "PUT";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, unknown>;
  headers?: Record<string, string>;
};

export type APIResponse<T> = {
  status_code: number;
  message: string;
  data: T | null;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(BASE_URL + path);

  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(url.toString(), {
    method: options.method ?? "GET",
    headers,
    body:
      options.body === undefined
        ? undefined
        : typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body),
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      json?.message ??
      `HTTP ${res.status} ${res.statusText || "Request failed"}`;
    throw new Error(message);
  }

  return json as T;
}

export const http = {
  get: <T>(path: string, query?: RequestOptions["query"]) =>
    request<T>(path, { method: "GET", query }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body }),
};
