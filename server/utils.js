exports.calculatePrice = (isbn) => {
  if (isbn && isbn.length >= 4) {
    const lastFourDigits = isbn.slice(-4);
    const numericValue = parseInt(lastFourDigits);
    return (numericValue / 100).toFixed(2);
  }
  return "21.00"; // Default price
};

// Default thumbnail URL
exports.defaultThumbnail =
  "https://i0.wp.com/roadmap-tech.com/wp-content/uploads/2019/04/placeholder-image.jpg?resize=400%2C400&ssl=1";
