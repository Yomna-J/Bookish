import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  token: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
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
      fetch("http://localhost:5000/api/auth/user", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to fetch user data");
          }
        })
        .then((userData) => {
          setUserContext({
            token: storedToken,
            ...userData,
          });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setUserContext(null);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser: setUserContext }}>
      {children}
    </AuthContext.Provider>
  );
};
