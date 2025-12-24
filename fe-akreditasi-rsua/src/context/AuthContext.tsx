import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { logoutApi } from "../services/auth";

export type Role = "perawat" | "unit" | "mutu";

type AuthContextType = {
  role: Role | null;
  accessToken: string | null;
  refreshToken: string | null;
  setRole: (role: Role | null) => void;
  setTokens: (tokens: {
    accessToken: string | null;
    refreshToken: string | null;
  }) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_KEY = "userRole";
const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRoleState] = useState<Role | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem(ROLE_KEY) as Role | null;
    const storedAccess = localStorage.getItem(ACCESS_KEY);
    const storedRefresh = localStorage.getItem(REFRESH_KEY);

    if (storedRole) setRoleState(storedRole);
    if (storedAccess) setAccessTokenState(storedAccess);
    if (storedRefresh) setRefreshTokenState(storedRefresh);
  }, []);

  const setRole = (newRole: Role | null) => {
    setRoleState(newRole);
    if (newRole) {
      localStorage.setItem(ROLE_KEY, newRole);
    } else {
      localStorage.removeItem(ROLE_KEY);
    }
  };

  const setTokens = (tokens: {
    accessToken: string | null;
    refreshToken: string | null;
  }) => {
    setAccessTokenState(tokens.accessToken);
    setRefreshTokenState(tokens.refreshToken);

    if (tokens.accessToken) {
      localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    } else {
      localStorage.removeItem(ACCESS_KEY);
    }

    if (tokens.refreshToken) {
      localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
    } else {
      localStorage.removeItem(REFRESH_KEY);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setRole(null);
      setTokens({ accessToken: null, refreshToken: null });
    }
  };

  const value = useMemo(
    () => ({ role, accessToken, refreshToken, setRole, setTokens, logout }),
    [role, accessToken, refreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

