// Load environment variables
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
// Database connection
async function dbConnection() {
  try {
    await mongoose.connect(
      process.env.DB_URL || "mongodb://127.0.0.1:27017/ProjectOne",
    );
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

dbConnection();
// call schema
const Task = require("./models/Task");
const Contact = require("./models/Contact");
const Author = require("./models/Author");
const Book = require("./models/Book");
const Product = require("./models/Product");
//make a post rout for to do list
app.post("/api/tasks", async (req, res) => {
  try {
    // validation for data come from user
    const title = req.body;
    const task = await Task.create(title);
    res.json({
      success: true,
      msg: "Task created successfully",
      data: task,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
//get tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const task = await Task.find();
    const count = await Task.countDocuments();
    res.json({
      success: true,
      msg: "Tasks fetched successfully",
      totalTasks: count,
      data: task,
    });
  } catch (err) {
    console.log(err);
  }
});
//post contact
app.post("/api/contact", async (req, res) => {
  try {
    //check for validation come from user
    const { fullName, phones = [], socialMedia = {} } = req.body;
    const contact = await Contact.create({ fullName, phones, socialMedia });
    res.json({
      success: true,
      msg: "Contact created successfully",
      data: contact,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
//get contact
app.get("/api/contact", async (req, res) => {
  try {
    const contact = await Contact.find();
    const count = await Contact.countDocuments();
    res.json({
      success: true,
      msg: "Contacts fetched successfully",
      totalContacts: count,
      data: contact,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
//delete contact
app.delete("/api/contact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        msg: "contact not found",
        data: contact,
      });
    }
    res.json({
      success: true,
      msg: "Contact deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
});

//post author name
app.post("/api/author", async (req, res) => {
  try {
    const { name } = req.body; // destructure 'name' from body
    if (!name) {
      return res.status(400).json({
        success: false,
        msg: "Name is required",
      });
    }

    const author = await Author.create({ name });
    res.json({
      success: true,
      msg: "Author created successfully",
      data: author,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
});
//get authors
app.get("/api/authors", async (req, res) => {
  try {
    const author = await Author.find();
    const count = await Author.countDocuments();
    res.json({
      success: true,
      msg: "Authors fetched successfully",
      totalAuthors: count,
      data: author,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
// post books
app.post("/api/book", async (req, res) => {
  try {
    const { title, authorId } = req.body;
    if (!title || !authorId) {
      return res.status(400).json({
        success: false,
        msg: "title and author are required",
      });
    }
    const book = await Book.create({ title, authorId });
    res.json({
      success: true,
      msg: "Book created successfullu",
      data: book,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
});
// get book populate with author
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find().populate("authorId", "name");
    const count = await Book.countDocuments();
    res.json({
      success: true,
      msg: "Books fetched successfully",
      totalBooks: count,
      data: books,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
// delete author
app.delete("/api/author/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Book.deleteMany({ author: id });
    const author = await Author.findByIdAndDelete(id);
    if (!author) {
      return res.status(404).json({ success: false, msg: "Author not found" });
    }
    res.json({
      success: true,
      msg: "Author and their books deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
//delete books
app.delete("/api/book/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ success: false, msg: "Book not found" });
    }
    res.json({
      success: true,
      msg: "Book deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
//post products
app.post("/api/product", async (req, res) => {
  try {
    const { name, category, price } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        msg: "name , category and price are required",
      });
    }
    const product = await Product.create({ name, category, price });
    res.json({
      success: true,
      msg: "Product created successfully",
      data: product,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
// get products
app.get("/api/products", async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category) {
      filter.category = category; 
    }
    const products = await Product.find(filter);
    const count= await Product.countDocuments()
    res.json({
      success: true,
      msg: "Products fetched successfully",
      totalProducts:count,
      data: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
});
//delete product
app.delete("/api/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.deleteMany({ author: id });
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }
    res.json({
      success: true,
      msg: "Product deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
