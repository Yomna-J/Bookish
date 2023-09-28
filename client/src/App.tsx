import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import SearchResults from "./pages/SearchResults";
import { CartProvider } from "react-use-cart";
import Account from "./pages/Account";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import PersistLogin from "./components/PersistLogin";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
              <Route path="search" element={<SearchResults />} />

              {/* Protected routes */}
              <Route element={<PersistLogin />}>
                <Route element={<PrivateRoute />}>
                  <Route path="account" element={<Account />} />
                </Route>
              </Route>
              {/* catch all */}
              {/* <Route path="*" element={<Missing />} /> */}
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};
export default App;
