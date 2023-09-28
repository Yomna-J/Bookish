import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main className="App text-darkGray">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
