import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useCart } from "react-use-cart";
import BookCard from "../components/UI/BookCard";
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

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("query");
  const { addItem } = useCart();
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (searchQuery) {
        const response = await fetch(
          `http://localhost:5000/search?query=${searchQuery}`
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        } else {
          console.error("Error:", response.status);
        }
      } else {
        setSearchResults([]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setIsLoading(false);
    }
  };

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

  if (error) {
    return <p>Error fetching search results. Please try again later.</p>;
  }

  return (
    <div className="mx-auto px-4 md:px-0 lg:max-w-7xl">
      <h1 className="my-7 text-2xl font-bold">Results</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={index} height={300} width={290} />
          ))}
        </div>
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {searchResults.map((book: Book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => handleAddToCart(book)}
            />
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default SearchResults;
