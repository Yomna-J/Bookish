import React from "react";
import Hero from "./components/Hero";
import RegistrationForm from "./pages/RegistrationForm";

const App: React.FC = () => {
  const handleRegister = (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    // Implement your registration logic here
    console.log("Register:", email, password, firstName, lastName);
  };

  return (
    <div className="App">
      <Hero />
      <RegistrationForm onRegister={handleRegister} />
    </div>
  );
};

export default App;
