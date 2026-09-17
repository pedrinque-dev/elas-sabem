const API_BASE = "/api";

export class ApiClientError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function getToken(): string | null {
  return localStorage.getItem("elas-sabem:admin-token");
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem("elas-sabem:admin-token", token);
  else localStorage.removeItem("elas-sabem:admin-token");
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false } = options;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiClientError(
      response.status,
      data?.error?.message ?? "Ocorreu um erro inesperado. Tente novamente.",
      data?.error?.details
    );
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, auth = false) => request<T>(path, { method: "GET", auth }),
  post: <T>(path: string, body?: unknown, auth = false) =>
    request<T>(path, { method: "POST", body, auth }),
  put: <T>(path: string, body?: unknown, auth = false) =>
    request<T>(path, { method: "PUT", body, auth }),
  patch: <T>(path: string, body?: unknown, auth = false) =>
    request<T>(path, { method: "PATCH", body, auth }),
  delete: <T>(path: string, auth = false) => request<T>(path, { method: "DELETE", auth }),
};
