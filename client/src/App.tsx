import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import { CartProvider } from "react-use-cart";
import Account from "./pages/Account";
import PrivateRoute from "./components/PrivateRoute";
import PersistLogin from "./components/PersistLogin";
import BookDetails from "./pages/BookDetails";
import Layout from "./components/UI/Layout";
import Cart from "./pages/Cart";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CookieConsent from "react-cookie-consent";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route element={<PersistLogin />}>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
                <Route path="search" element={<SearchResults />} />
                <Route path="books/:bookId" element={<BookDetails />} />
                <Route path="cart" element={<Cart />} />

                {/* Protected routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="account" element={<Account />} />
                </Route>
                <Route element={<PrivateRoute />}>
                  <Route
                    path="checkout-success"
                    element={<CheckoutSuccess />}
                  />
                </Route>
                {/* catch all */}
                {/* <Route path="*" element={<Missing />} /> */}
              </Route>
            </Route>
          </Routes>
        </CartProvider>
        <CookieConsent
          location="bottom"
          cookieName="myAwesomeCookieName3"
          expires={999}
          overlay
          style={{
            background: "#E8FFFC",
            color: "#001220",
          }}
          buttonStyle={{
            background: "#14b8a6",
            color: "white",
            fontWeight: "bolder",
            borderRadius: "5px",
          }}
        >
          <p>
            This website is for testing purposes only. The books, prices, and
            transactions are simulated and not real. We do not sell any
            products, and the prices are fake. By continuing, you acknowledge
            that this is a test environment, and you should not enter any real
            personal or financial information. For testing purposes, you can use
            the fake credit card number 4242 4242 4242 4242 with any future
            expiration date and any three-digit CVC.
          </p>
          <br />
          <p>
            Please be aware that any transactions made on this site are not
            valid, and no actual products will be shipped. By continuing, you
            agree to these terms and understand that this is a testing
            environment.
          </p>
        </CookieConsent>
      </AuthProvider>
    </Router>
  );
};
export default App;
