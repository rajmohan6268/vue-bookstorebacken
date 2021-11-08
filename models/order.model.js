const mongoose = require("mongoose");

const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    email: String,
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    bookdata:Object,

    quantity: Number,
    amount: Number,
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: { type: Date, default: Date.now },
  })
);

module.exports = Order;
