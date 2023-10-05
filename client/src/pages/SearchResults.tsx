import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "../components/UI/BookCard";
import { ToastContainer, toast } from "react-toastify";
import { useCart } from "react-use-cart";

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
  const [searchResults, setSearchResults] = useState([]);
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
          `http://localhost:5000/api/search?q=${searchQuery}`
        ); // Replace with your actual backend API endpoint
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
        <p>Loading...</p>
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
