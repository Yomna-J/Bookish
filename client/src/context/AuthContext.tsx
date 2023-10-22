import React, { createContext, useState, useContext } from "react";

export type AuthState = {
  email: string | null;
  accessToken: string | null;
};

// Define the type for AuthContext
type AuthContextType = {
  auth: AuthState | null;
  setAuth: (auth: AuthState | null) => void;
};

// Provide the AuthContextType as the generic parameter when creating the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

// Export the useContext hook with AuthContext
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
