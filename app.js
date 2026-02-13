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
const Students = require("./models/Students");
const ClassRoom = require("./models/ClassRoom");

//post students
app.post("/api/student", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        msg: "Name and email are required",
      });
    }

    const student = await Students.create({ name, email });

    res.status(201).json({
      success: true,
      msg: "Student created successfully",
      data: student,
    });
  } catch (err) {
    console.error(err);

    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        msg: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
});

//get all students
app.get("/api/students", async (req, res) => {
  try {
    const student = await Students.find();
    const count = await Students.countDocuments();
    res.json({
      success: true,
      msg: "Students fetched successfully",
      totalStudents: count,
      data: student,
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
//delete student
app.delete("/api/student/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Students.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ success: false, msg: "student not found" });
    }
    res.json({
      success: true,
      msg: "Student deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
//post classroom
app.post("/api/classroom", async (req, res) => {
  try {
    const { name, students } = req.body;

    if (!name || !students || students.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "name and students are required",
      });
    }

    const classroom = await ClassRoom.create({
      name,
      students,
    });

    res.status(201).json({
      success: true,
      msg: "classroom created successfully",
      data: classroom,
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

//get all ClassRooms
app.get("/api/classrooms", async (req, res) => {
  try {
    const classroom = await ClassRoom.find().populate("students", "name");
    const count = await ClassRoom.countDocuments();
    res.json({
      success: true,
      msg: "classroom fetched successfully",
      totalStudents: count,
      data: classroom,
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
//delete student
app.delete("/api/classroom/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const classroom = await ClassRoom.findByIdAndDelete(id);
    if (!ClassRoom) {
      return res
        .status(404)
        .json({ success: false, msg: "ClassRoom not found" });
    }
    res.json({
      success: true,
      msg: "ClassRoom deleted successfully",
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
