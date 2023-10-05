import hero from "../../assets/hero.svg";

const Hero = () => {
  return (
    <div className="my-4 w-screen bg-teal-50 p-4">
      <div className="mx-auto items-center px-4 md:flex md:justify-between md:px-0 lg:max-w-7xl">
        <div className="text-center md:w-1/2">
          <h1 className="font-comfortaa text-5xl font-extrabold">
            Welcome to Bookish
          </h1>
          <p className="mt-2 text-lg">
            Your ultimate destination for books and more.
          </p>
        </div>
        <img src={hero} alt="hero image" className="md:w-2/5" />
      </div>
    </div>
  );
};

export default Hero;
