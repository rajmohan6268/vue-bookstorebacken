const mongoose = require("mongoose");

const Book = mongoose.model(
  "Book",
  new mongoose.Schema({
    title: String,
    image: String,
    author: String,
    description: String,
    price: Number,
    quantity: Number,
    createdAt: { type: Date, default: Date.now },
  })
);

module.exports = Book;
