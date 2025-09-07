const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access");
}

function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh");
}

function setTokens(access: string, refresh: string) {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
}

function clearTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

async function refreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  const res = await fetch(API_BASE + "api/user/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) {
    clearTokens();
    return null;
  }
  const json = await res.json();
  if (json.access) {
    setTokens(json.access, refresh);
    return json.access;
  }
  return null;
}

export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  data?: any,
  options?: { auth?: boolean; headers?: Record<string, string> }
) {
  const url = endpoint.startsWith("http") ? endpoint : API_BASE + endpoint;
  let token = getToken();
  let headers: Record<string, string> = {
    ...(options?.headers || {}),
  };
  if (options?.auth) {
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  if (data && !(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  let res = await fetch(url, {
    method,
    headers,
    body: data
      ? data instanceof FormData
        ? data
        : JSON.stringify(data)
      : undefined,
  });

  // If unauthorized and auth required, try to refresh token and retry once
  if (options?.auth && res.status === 401) {
    const newToken = await refreshToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(url, {
        method,
        headers,
        body: data
          ? data instanceof FormData
            ? data
            : JSON.stringify(data)
          : undefined,
      });
    } else {
      clearTokens();
    }
  }
  return res.json();
}

// Auth and profile helpers (unchanged)
export async function register(data: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}) {
  return apiRequest("api/user/register/", "POST", data);
}

export async function login(email: string, password: string) {
  const json = await apiRequest("api/user/token/", "POST", { email, password });
  if (json.access && json.refresh) {
    setTokens(json.access, json.refresh);
    if (typeof window !== "undefined" && "has_profile" in json) {
      localStorage.setItem("has_profile", json.has_profile ? "true" : "false");
    }
  }
  return json;
}

export function logout() {
  clearTokens();
}

