const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId, // store as ObjectId
    ref: "Author", // reference to Author collection
    required: true,
  },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
