const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
  },
  { timestamps: true },
);

// Ensure the unique index exists
studentSchema.index({ email: 1 }, { unique: true });

const Students = mongoose.model("Student", studentSchema);
module.exports = Students;
