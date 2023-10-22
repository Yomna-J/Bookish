import React from "react";
import StarRatings from "react-star-ratings";
import { Link } from "react-router-dom";

type Book = {
  id: string;
  title: string;
  authors: string[];
  averageRating: number;
  ratingsCount: number;
  thumbnail: string;
  price: number;
};

type BookCardProps = {
  book: Book;
  onClick: () => void;
};

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  return (
    <div className="flex h-[300px] flex-col overflow-hidden rounded-lg border border-gray-100 shadow-md">
      <Link
        className="mt-2 flex h-40 items-center overflow-hidden rounded-xl"
        to={`/books/${book.id}`}
      >
        <img
          className="h-full w-full object-contain"
          src={book.thumbnail}
          alt={book.title}
        />
      </Link>
      <div className="flex grow flex-col justify-between p-5">
        <h5 className="text-lg font-bold text-black">{book.title}</h5>
        <h6 className="text-sm text-black">{book.authors?.join(", ")}</h6>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-lg text-black">${book.price}</span>
          </p>
          <div className="flex items-center gap-1">
            <StarRatings
              rating={book.averageRating || 0}
              starDimension="1rem"
              starSpacing=".1rem"
              starRatedColor="rgb(253,224,71)"
            />
            <p className="mt-1 text-xs">({book.ratingsCount || 0})</p>
          </div>
        </div>
        <button
          type="submit"
          className="text-md rounded-md bg-primary p-2 text-white hover:bg-darkPrimary"
          onClick={onClick}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BookCard;
