import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "react-use-cart";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useMediaQuery } from "react-responsive";
import axios from "../../api/axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../context/AuthContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type Book = {
  id: string;
  title: string;
  authors: string[];
  averageRating: number;
  ratingsCount: number;
  thumbnail: string;
  price: number;
};

const BookList: React.FC<{ category: string }> = ({ category }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const { addItem, totalItems, items } = useCart();
  const { auth } = useAuth();

  const axiosPrivate = useAxiosPrivate();

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

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`/books?category=${category}`);
        if (response.status === 200) {
          setBooks(response.data);
        } else {
          console.error("Error:", response.status);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [category]);

  const isDesktop = useMediaQuery({
    query: "(min-width: 1024px)",
  });

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 6,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">{category}</h1>
      </div>
      <Carousel
        responsive={responsive}
        itemClass="pr-4 my-4 mb-8"
        showDots={isDesktop ? true : false}
      >
        {books.length > 0
          ? books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => handleAddToCart(book)}
              />
            ))
          : Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} height={280} width={230} />
            ))}
      </Carousel>
      <ToastContainer />
    </div>
  );
};

export default BookList;
