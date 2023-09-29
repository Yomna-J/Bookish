import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "react-use-cart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../api/axios";

type Book = {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
  price: number;
  averageRating?: number | 0;
  ratingsCount: number;
  description?: string;
};

const BookDetails: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/book?bookId=${bookId}`
        );
        if (response.status === 200) {
          setBook(response.data);
        } else {
          console.error("Error:", response.status);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBook();
  }, [bookId]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const maxDescriptionLength = 300; // Maximum number of characters to display initially

  const handleAddToCart = (book: Book) => {
    addItem(book);
    toast.success("Book added to cart successfully!", {
      position: "bottom-left",
      autoClose: 2000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <div className="mx-auto flex flex-col items-center px-4 md:px-0 md:py-6 lg:max-w-7xl">
      {book && (
        <div className="mb-4 flex w-full flex-col gap-6 rounded-lg border border-gray-100 p-4 shadow-md md:w-[90%] md:flex-row">
          <img
            className="w-1/2 self-center object-contain md:mt-6 md:w-[20%] md:self-start"
            src={
              book.thumbnail ||
              "https://i0.wp.com/roadmap-tech.com/wp-content/uploads/2019/04/placeholder-image.jpg?resize=400%2C400&ssl=1"
            }
            alt={book.title}
          />
          <div className="flex-1">
            <h5 className="text-xl font-bold text-black md:mt-12">
              {book.title}
            </h5>
            <h6 className="text-lg text-black">{book.authors}</h6>

            <div className="mb-5 flex flex-col">
              <p>
                <span className="text-lg text-black">${book.price}</span>
              </p>
              <div className="order-first flex items-center gap-1">
                <StarRatings
                  rating={book.averageRating}
                  starDimension="1rem"
                  starSpacing=".1rem"
                  starRatedColor="rgb(253,224,71)"
                />
                <p className="mt-1 text-xs">
                  ({book.ratingsCount ? book.ratingsCount : "0"})
                </p>
              </div>
            </div>
            <div>
              {showFullDescription ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: book.description || "",
                  }}
                />
              ) : (
                <div>
                  <p
                    style={{
                      maxHeight: showFullDescription ? "none" : "6em",
                      overflow: "hidden",
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        book.description?.slice(0, maxDescriptionLength) || "",
                    }}
                  />
                  {(book?.description?.length ?? 0) > maxDescriptionLength && (
                    <button
                      className="mx-1 font-bold text-primary hover:underline"
                      onClick={toggleDescription}
                    >
                      Read More
                    </button>
                  )}
                </div>
              )}
              {showFullDescription && (
                <button
                  className="mx-1 font-bold text-primary hover:underline"
                  onClick={toggleDescription}
                >
                  Read Less
                </button>
              )}
            </div>
            <button
              type="submit"
              className="text-md mt-4 w-full rounded-md bg-primary p-2 text-white hover:bg-darkPrimary md:w-1/3"
              onClick={() => handleAddToCart(book)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default BookDetails;
