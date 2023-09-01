import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "react-use-cart";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useMediaQuery } from "react-responsive";

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
  const { addItem } = useCart();

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
    const fetchBooks = async () => {
      try {
        const response = await fetch(`/api/books?category=${category}`);
        if (response.ok) {
          const data: Book[] = await response.json();
          setBooks(data);
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
        {books.length > 0 ? (
          books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => handleAddToCart(book)}
            />
          ))
        ) : (
          <p>No books available in this category.</p>
        )}
      </Carousel>
      <ToastContainer />
    </div>
  );
};

export default BookList;
