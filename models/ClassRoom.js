const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    students: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Student",
      required: true,
    },
  },
  { timestamps: true },
);

const ClassRoom = mongoose.model("ClassRoom", classroomSchema);
module.exports = ClassRoom;
