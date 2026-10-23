/* eslint react-refresh/only-export-components: off */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getToken, loginApi, registerApi, saveToken } from "../services/api";
import { api } from "../services/api";
import { authenticationOptionsFromJson, credentialToJson, ensurePasskeySupport } from "../services/webauthn";

const AuthContext = createContext(null);
const SESSION_KEY = "cybersafe.user";
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; } catch { return null; } });
  const [ready, setReady] = useState(() => Boolean(getToken() && localStorage.getItem(SESSION_KEY)));
  const logout = useCallback(() => { saveToken(null); localStorage.removeItem(SESSION_KEY); setUser(null); setReady(false); }, []);
  useEffect(() => { const expire = () => logout(); window.addEventListener("cybersafe:unauthorized", expire); return () => window.removeEventListener("cybersafe:unauthorized", expire); }, [logout]);
  const accept = useCallback((result) => { saveToken(result.accessToken); localStorage.setItem(SESSION_KEY, JSON.stringify(result.user)); setUser(result.user); setReady(true); return result.user; }, []);
  const login = useCallback(async (email, password) => {
    const result = await loginApi(email, password);
    return result.requiresMfa ? result : accept(result);
  }, [accept]);
  const completeTotpLogin = useCallback(async (challengeToken, code) => accept(await api("/auth/totp/login", { method: "POST", body: { challengeToken, code } })), [accept]);
  const loginWithPasskey = useCallback(async (email) => {
    ensurePasskeySupport();
    const start = await api("/auth/passkeys/login/options", { method: "POST", body: { email } });
    const credential = await navigator.credentials.get({ publicKey: authenticationOptionsFromJson(start.options) });
    if (!credential) throw new Error("Passkey sign-in was cancelled.");
    return accept(await api("/auth/passkeys/login/finish", { method: "POST", body: { flowId: start.flowId, credential: credentialToJson(credential) } }));
  }, [accept]);
  const register = useCallback(async (data) => accept(await registerApi(data)), [accept]);
  const value = useMemo(() => ({ user, ready, login, completeTotpLogin, loginWithPasskey, register, logout }), [user, ready, login, completeTotpLogin, loginWithPasskey, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used inside AuthProvider"); return value; }
