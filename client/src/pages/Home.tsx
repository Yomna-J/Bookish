import BookCard from "../components/UI/BookCard";
import BookList from "../components/UI/BookList";
import Hero from "../components/UI/Hero";

/* 

TODO: 5. Design account page
TODO: 7. Cart Check out
FIXME: 8. fix the title in bookCard taking extra space
*/
const Home = () => {
  return (
    <>
      <Hero />
      <div className="mx-auto px-4 md:px-0 lg:max-w-7xl">
        <BookList category="Science" />
        <BookList category="Fantasy" />
        <BookList category="Poetry" />
        <BookList category="Inspirational" />
      </div>
    </>
  );
};

export default Home;
