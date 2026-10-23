const API_BASE = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8080/api").replace(/\/$/, "");
const TOKEN_KEY = "cybersafe.accessToken";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const saveToken = (token) => token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

export async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers, body: options.body instanceof FormData ? options.body : options.body ? JSON.stringify(options.body) : undefined });
  } catch {
    throw new Error("Could not reach the API. Check that the backend is running on http://localhost:8080.");
  }
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try { const data = await response.json(); message = data.error || data.message || message; } catch { /* use status text */ }
    if (response.status === 401) { saveToken(null); window.dispatchEvent(new Event("cybersafe:unauthorized")); }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const loginApi = (email, password) => api("/auth/login", { method: "POST", body: { email, password } });
export const registerApi = (payload) => api("/auth/register", { method: "POST", body: payload });
