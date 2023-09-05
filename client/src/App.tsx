import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import SearchResults from "./pages/SearchResults";
import { CartProvider } from "react-use-cart";
import Account from "./pages/Account";

const App: React.FC = () => {
  return (
    <div className="App text-darkGray">
      <Router>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/account" element={<Account />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </Router>
    </div>
  );
};
export default App;
