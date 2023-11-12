import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useLogout from "../hooks/useLogout";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
type User = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const Account = () => {
  const [user, setUser] = useState<User | null>(null); // Initialize as null or with default user data if available
  const [loading, setLoading] = useState(true);
  const { emptyCart } = useCart();
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = useLogout();

  const handleLogout = async () => {
    emptyCart();
    await logout();
    navigate("/");
  };

  const handleCancelLogout = () => {
    setShowLogoutWarning(false);
  };

  const handleConfirmLogout = () => {
    setShowLogoutWarning(false);
    handleLogout();
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUser = async () => {
      try {
        const response = await axiosPrivate.get("/user", {
          signal: controller.signal,
        });
        isMounted && setUser(response.data);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUser();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="mx-auto flex flex-col items-center px-4 md:px-0 lg:max-w-7xl">
      <h1 className="my-6 self-start text-2xl font-bold">My Account</h1>

      <div className="mb-4 w-full rounded-lg border border-gray-100 p-4 shadow-md md:w-[90%]">
        {/* Display user data here from 'userData' state */}
        {user ? (
          <>
            <h1 className="text-md my-1 font-bold">Personal Information</h1>
            <hr />

            <form className="my-3 mb-6 grid w-full grid-cols-2 gap-6">
              {/* First Name */}
              <div className="col-span-2 md:col-auto">
                <label htmlFor="firstName" className="block">
                  First Name
                </label>
                <input
                  value={user.firstName || ""}
                  id="firstName"
                  type="text"
                  readOnly
                  className="w-full cursor-not-allowed rounded-md border bg-lightGrayBackground px-2 py-1"
                />
              </div>

              {/* Last Name */}
              <div className="col-span-2 md:col-auto">
                <label htmlFor="lastName" className="block">
                  Last Name
                </label>
                <input
                  value={user.lastName || ""}
                  id="lastName"
                  type="text"
                  readOnly
                  className="w-full cursor-not-allowed rounded-md border bg-lightGrayBackground px-2 py-1"
                />
              </div>
            </form>

            <h1 className="text-md my-1 font-bold">Email Address</h1>
            <hr />

            <form className="my-3 grid w-full grid-cols-2 gap-6">
              {/* Email Address */}
              <div className="col-span-2">
                <label htmlFor="email" className="block">
                  Email Address
                </label>
                <input
                  value={user.email || ""}
                  id="email"
                  type="text"
                  readOnly
                  className="w-full cursor-not-allowed rounded-md border bg-lightGrayBackground px-2 py-1"
                />
              </div>
            </form>

            <button
              onClick={() => setShowLogoutWarning(true)}
              className="mt-6 w-full rounded-md border bg-red-50 py-2 font-bold text-red-600"
            >
              Log Out
            </button>
          </>
        ) : (
          <div className="grid w-full grid-cols-2 gap-6">
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} />
            <div className="col-span-2 ">
              <Skeleton height={20} />
              <Skeleton height={20} />
            </div>
          </div>
        )}
      </div>

      {/* Logout Warning */}
      {showLogoutWarning && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-auto w-[90%] md:w-1/5">
            <div className="flex flex-col rounded-lg bg-white p-5 shadow">
              <div className="flex flex-col items-center text-center">
                <div className="inline-block rounded-full bg-red-50 p-4">
                  <svg
                    className="h-12 w-12 fill-current text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" />
                  </svg>
                </div>
                <h2 className="mt-2 font-semibold text-gray-800">Log Out</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Are you sure you want to log out?
                </p>
              </div>

              <div className="mt-3 flex items-center">
                <button
                  onClick={handleCancelLogout}
                  className="flex-1 rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmLogout}
                  className="ml-2 flex-1 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Account;
