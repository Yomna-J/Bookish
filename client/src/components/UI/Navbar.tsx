import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { RiAccountCircleFill } from "react-icons/ri";
import { FiShoppingCart } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
import { searchSchema } from "../../schemas";
import useAuth from "../../context/AuthContext";

const Navbar: React.FC = () => {
  const [navbar, setNavbar] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("query");

  const { totalItems } = useCart();

  const toggleNavbar = () => {
    setNavbar(!navbar);
  };

  const closeNavbar = () => {
    setNavbar(false);
  };

  const onSubmit = async (values: { search: string }) => {
    const searchValue = values.search ? values.search.trim() : "";

    if (searchValue) {
      navigate(`/search?query=${searchValue}`);
    }
  };

  const { values, handleBlur, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: {
        search: "",
      },
      validationSchema: searchSchema,
      onSubmit,
    });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (setFieldValue) {
      setFieldValue("search", value);
    }
  };

  useEffect(() => {
    setFieldValue("search", searchQuery || "");
  }, [searchQuery, setFieldValue]);

  return (
    <div className="">
      <nav className="mx-auto gap-3 px-4 md:flex md:items-center md:px-0 lg:max-w-7xl">
        <div className="flex items-center justify-between py-3 md:block md:py-5">
          <Link to="/">
            <h1 className="font-comfortaa text-4xl font-extrabold text-primary">
              Bookish
            </h1>
          </Link>
          <div className="md:hidden">
            <button
              className="rounded-md p-2 text-gray-700 outline-none focus:border focus:border-gray-400"
              onClick={toggleNavbar}
            >
              {navbar ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div
          className={`mt-8 grow gap-6 p-3 md:mt-0 md:flex md:items-center md:justify-between md:pb-0 ${
            navbar ? "flex flex-col " : "hidden"
          }`}
        >
          <form className="grow" onSubmit={handleSubmit}>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <input
                type="text"
                id="search"
                className="block w-full rounded-lg border-2 bg-white p-1 pl-10 text-sm outline-none focus:border-primary focus:ring-primary "
                placeholder="Search"
                value={values.search}
                onChange={handleSearchChange}
                onBlur={handleBlur}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 rounded-r-lg bg-primary p-2 text-xs text-white hover:bg-darkPrimary"
                onClick={() => {}}
              >
                Search
              </button>
            </div>
          </form>

          {!auth?.accessToken && (
            <>
              <Link
                to="/register"
                className="hover:text-primary"
                onClick={closeNavbar}
              >
                Register
              </Link>
              <Link
                to="/login"
                className="hover:text-primary"
                onClick={closeNavbar}
              >
                Log in
              </Link>
            </>
          )}
          <div className="flex flex-col gap-6 md:flex-row md:gap-3">
            <Link to="/cart" className=" hover:text-primary">
              <div className="flex gap-1 hover:cursor-pointer hover:text-primary  md:px-2">
                Cart
                <span className="relative inline-block">
                  <FiShoppingCart className="text-2xl" />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 inline-flex translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-primary px-2 py-1 text-xs font-bold leading-none text-white">
                      {totalItems}
                    </span>
                  )}
                </span>
              </div>
            </Link>
            {auth?.accessToken && (
              <button
                className="flex gap-1  hover:text-primary  md:px-2"
                onClick={() => navigate("/account", { replace: true })}
              >
                Account
                <RiAccountCircleFill className="text-2xl" />
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
