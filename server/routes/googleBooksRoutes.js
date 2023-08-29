const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/books", async (req, res) => {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=query&startIndex=0&maxResults=30`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data && data.items) {
        const resultsWithPrice = data.items.map((item) => {
          const isbnObj = item.volumeInfo.industryIdentifiers?.find(
            (identifier) => identifier.type === "ISBN_13"
          );
          const price = calculatePrice(isbnObj?.identifier);
          return { ...item, price };
        });
        res.json(resultsWithPrice);
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
        const isbnObj = data.volumeInfo.industryIdentifiers?.find(
          (identifier) => identifier.type === "ISBN_13"
        );
        const price = calculatePrice(isbnObj?.identifier);
        res.json({ ...data, price });
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
        const resultsWithPrice = data.items.map((item) => {
          const isbnObj = item.volumeInfo.industryIdentifiers?.find(
            (identifier) => identifier.type === "ISBN_13"
          );
          const price = calculatePrice(isbnObj?.identifier);
          return { ...item, price };
        });
        res.json(resultsWithPrice);
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
