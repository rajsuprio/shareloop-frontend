import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("shareloopUser");
    const savedToken = localStorage.getItem("shareloopToken");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  function login(userData, tokenData) {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("shareloopUser", JSON.stringify(userData));
    localStorage.setItem("shareloopToken", tokenData);
  }

  function logout() {
    setUser(null);
    setToken("");
    localStorage.removeItem("shareloopUser");
    localStorage.removeItem("shareloopToken");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAdmin: user?.role === "admin",
        isModerator: user?.role === "moderator",
        isOrganization: user?.role === "organization",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}