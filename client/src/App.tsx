import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import SearchResults from "./pages/SearchResults";

const App: React.FC = () => {
  return (
    <div className="App text-darkGray">
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
};
export default App;
