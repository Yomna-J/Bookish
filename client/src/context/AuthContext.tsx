import React, { createContext, useContext, useState } from "react";

type AuthState = {
  email: string | null;
  accessToken: string | null;
};

const AuthContext = createContext<
  | {
      auth: AuthState | null;
      setAuth: (auth: AuthState | null) => void;
    }
  | undefined
>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<AuthState | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
