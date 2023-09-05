import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  token: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const setUserContext = (user: User | null) => {
    setUser(user);
    if (user) {
      localStorage.setItem("userToken", user.token);
    } else {
      localStorage.removeItem("userToken");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    if (storedToken) {
      setUserContext({ token: storedToken });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser: setUserContext }}>
      {children}
    </AuthContext.Provider>
  );
};
