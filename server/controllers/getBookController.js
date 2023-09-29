const fetch = require("node-fetch");
const { calculatePrice, defaultThumbnail } = require("../utils");

exports.getBook = async (req, res) => {
  const { bookId } = req.query;
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
          description: data.volumeInfo.description,
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
};
