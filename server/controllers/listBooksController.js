const fetch = require("node-fetch");
const { calculatePrice, defaultThumbnail } = require("../utils");

exports.listBooks = async (req, res) => {
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
};
