import { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
import success from "../assets/success.svg";

const CheckoutSuccess = () => {
  const [isPaid, setIsPaid] = useState(false);
  const navigate = useNavigate();
  const { emptyCart } = useCart();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axiosPrivate.get("/verify-payment");
        if (response.status === 200) {
          emptyCart();
          setIsPaid(true);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error(error);
      }
    };

    verifyPayment();
  }, []);

  return (
    <div>
      {isPaid && (
        <div className="mx-auto flex h-[80vh] flex-col items-center justify-center px-4 md:px-0 lg:max-w-7xl">
          <img src={success} alt="empty cart" className="md:w-1/2" />
          <h1 className="mb-3 text-2xl font-bold">
            Your order has been placed successfully
          </h1>
          <button
            className="w-44 rounded-full bg-primary p-2 text-lg font-bold text-white hover:bg-darkPrimary"
            onClick={() => {
              navigate("/");
            }}
          >
            Discover Books
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutSuccess;
