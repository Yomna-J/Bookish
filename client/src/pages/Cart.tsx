import { useEffect } from "react";
import { useCart } from "react-use-cart";
import { useNavigate } from "react-router-dom";
import emptyCart from "../assets/emptycart.svg";
import CartItem from "../components/UI/CartItemn";
import useAuth from "../context/AuthContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Cart = () => {
  const { isEmpty, totalItems, items, cartTotal } = useCart();
  const { auth } = useAuth();

  const shippingCharges = 13.99;
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const updateCart = async () => {
      try {
        const cartData = {
          cart: {
            items: items,
          },
        };
        await axiosPrivate.post("/update-cart", cartData);
      } catch (err) {
        console.error(err);
      }
    };

    if (auth?.accessToken != null) {
      updateCart();
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [totalItems]);

  const handleCheckout = async () => {
    //TODO: handle shipping charges
    //TODO: handle removing cart items after checkout
    //TODO: style the checkout page
  };

  if (isEmpty)
    return (
      <div className="mx-auto flex h-[80vh] flex-col items-center justify-center px-4 md:px-0 lg:max-w-7xl">
        <img src={emptyCart} alt="empty cart" className="md:w-1/2" />
        <h1 className="mb-3 text-2xl font-bold">Your cart is empty</h1>
        <button
          className="w-44 rounded-full bg-primary p-2 text-lg font-bold text-white hover:bg-darkPrimary"
          onClick={() => {
            navigate("/");
          }}
        >
          Discover Books
        </button>
      </div>
    );

  return (
    <div className="mx-auto px-4 md:px-0 lg:max-w-7xl">
      <div className="my-6">
        <h1 className="my-1 text-2xl font-bold">Shopping Cart</h1>
        <p className="text-gray-500">
          There are <span className="text-primary">{totalItems} books</span> in
          your cart
        </p>
      </div>

      <div className="gap-4 md:flex md:justify-between">
        <div className="md:w-full">
          {items &&
            items.map((item, i) => {
              return <CartItem item={item} key={i} />;
            })}
        </div>
        <div className="flex h-72 flex-col justify-between rounded-lg border border-gray-100 p-4 shadow-md md:w-3/5">
          <h5 className="text-xl font-bold text-black">Order Summary</h5>
          <div>
            <div className="mb-4 flex justify-between font-bold">
              <p>Subtotal</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-bold">
              <p>Shipping Charges</p>
              <p>${shippingCharges}</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xl font-extrabold">
              <p>Total Price</p>
              <p>${(cartTotal + shippingCharges).toFixed(2)}</p>
            </div>
          </div>

          <button
            className="rounded-md bg-primary p-2 text-lg font-bold text-white hover:bg-darkPrimary"
            onClick={handleCheckout}
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
