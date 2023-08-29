import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <div className="App text-darkGray">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
};
export default App;
