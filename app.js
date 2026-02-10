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
const Book=require("./models/Book")
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
    res.json({
      success: true,
      msg: "Tasks fetched successfully",
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
    res.json({
      success: true,
      msg: "Contacts fetched successfully",
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
// post books
app.post("/api/book",async(req,res)=>{
  try{
    const { title, authorId }=req.body;
    if (!title||!authorId) {
      return res.status(400).json({
        success: false,
        msg: "title and author are required",
      });
    }
const book= await Book.create({title,authorId})
res.json({
  success:true,
  msg:"Book created successfullu",
  data:book
})
  }catch(err){
console.error(err);
res.status(500).json({
  success: false,
  msg: "Server error",
  error: err.message,
});
  }
})
// get book populate with author

app.get("/api/books",async(req,res)=>{
  try{
const books= await Book.find().populate("author","name")
 res.json({
      success: true,
      msg: "Books fetched successfully",
      data: books
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
  
})
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
