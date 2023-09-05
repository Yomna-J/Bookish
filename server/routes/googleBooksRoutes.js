const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const defaultThumbnail =
  "https://i0.wp.com/roadmap-tech.com/wp-content/uploads/2019/04/placeholder-image.jpg?resize=400%2C400&ssl=1";

router.get("/books", async (req, res) => {
  const { category } = req.query;

  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${category}&startIndex=0&maxResults=30`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data && data.items) {
        const resultsWithThumbnail = data.items.map((item) => {
          const thumbnail =
            item.volumeInfo.imageLinks?.thumbnail || defaultThumbnail;
          const priceString = calculatePrice(
            item.volumeInfo.industryIdentifiers?.find(
              (identifier) => identifier.type === "ISBN_13"
            )?.identifier
          );
          const price = parseFloat(priceString);
          return {
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            averageRating: item.volumeInfo.averageRating,
            ratingsCount: item.volumeInfo.ratingsCount,
            thumbnail,
            price,
          };
        });
        res.json(resultsWithThumbnail);
      }
    } else {
      console.error("Error:", response.status);
      res.status(response.status).json({ error: "Error fetching books" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/book/:bookId", async (req, res) => {
  const { bookId } = req.params;

  try {
    const url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data) {
        const thumbnail =
          data.volumeInfo.imageLinks?.thumbnail || defaultThumbnail;
        const priceString = calculatePrice(
          data.volumeInfo.industryIdentifiers?.find(
            (identifier) => identifier.type === "ISBN_13"
          )?.identifier
        );
        const price = parseFloat(priceString);
        res.json({
          id: data.id,
          title: data.volumeInfo.title,
          authors: data.volumeInfo.authors,
          averageRating: data.volumeInfo.averageRating,
          ratingsCount: data.volumeInfo.ratingsCount,
          thumbnail,
          price,
        });
      }
    } else {
      console.error("Error:", response.status);
      res
        .status(response.status)
        .json({ error: "Error fetching book details" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/search", async (req, res) => {
  const { q } = req.query;

  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${q}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data && data.items) {
        const resultsWithThumbnail = data.items.map((item) => {
          const thumbnail =
            item.volumeInfo.imageLinks?.thumbnail || defaultThumbnail;
          const priceString = calculatePrice(
            item.volumeInfo.industryIdentifiers?.find(
              (identifier) => identifier.type === "ISBN_13"
            )?.identifier
          );
          const price = parseFloat(priceString);
          return {
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            averageRating: item.volumeInfo.averageRating,
            ratingsCount: item.volumeInfo.ratingsCount,
            thumbnail,
            price,
          };
        });
        res.json(resultsWithThumbnail);
      }
    } else {
      console.error("Error:", response.status);
      res
        .status(response.status)
        .json({ error: "Error fetching search results" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Calculate price based on ISBN identifier as a dummy price
const calculatePrice = (isbn) => {
  if (isbn && isbn.length >= 4) {
    const lastFourDigits = isbn.slice(-4);
    const numericValue = parseInt(lastFourDigits);
    return (numericValue / 100).toFixed(2);
  }
  return "21.00"; // Default price
};

module.exports = router;
