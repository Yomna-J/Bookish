import React from "react";
import { IoClose } from "react-icons/io5";
import { useCart } from "react-use-cart";
import { Link } from "react-router-dom";

type Item = {
  id?: string;
  title?: string;
  authors?: string[];
  averageRating?: number;
  ratingsCount?: number;
  thumbnail?: string;
  price?: number;
  quantity?: number;
};

interface CartItemProps {
  item: Item;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateItemQuantity, removeItem } = useCart();

  return (
    <div className="mb-4 rounded-lg border border-gray-100 p-4 shadow-md">
      <button
        className="float-right flex gap-1 hover:text-primary md:px-2"
        onClick={() => {
          item.id && removeItem(item.id);
        }}
      >
        <IoClose className="text-2xl" />
      </button>

      <div className="md:flex">
        <Link to={`/books/${item.id}`}>
          <img
            className="mx-auto"
            src={
              item.thumbnail
                ? item.thumbnail
                : "https://i0.wp.com/roadmap-tech.com/wp-content/uploads/2019/04/placeholder-image.jpg?resize=400%2C400&ssl=1"
            }
            alt={item.title}
          />
        </Link>

        <div className="flex-grow flex flex-col justify-between p-5">
          <div>
            <h5 className="mb-2 text-lg font-bold text-black">{item.title}</h5>
            <h6 className="text-sm text-black">{item.authors?.join(", ")}</h6>
          </div>

          <div className="flex justify-between">
            <p className="text-lg font-bold text-black">${item.price}</p>
            <div className="flex items-center border-gray-100 md:order-first">
              <button
                className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-primary hover:text-blue-50"
                onClick={() => {
                  item.id &&
                    item.quantity &&
                    updateItemQuantity(item.id, item.quantity - 1);
                }}
              >
                -
              </button>
              <input
                className="h-8 w-8 border bg-white text-center text-xs outline-none"
                type="number"
                value={item.quantity}
                min={1}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value);
                  item.id && updateItemQuantity(item.id, newQuantity);
                }}
              />
              <button
                className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-primary hover:text-blue-50"
                onClick={() => {
                  item.id &&
                    item.quantity &&
                    updateItemQuantity(item.id, item.quantity + 1);
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
