// const mongoose = require("mongoose");

// const studentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   rollNo: { type: String, required: true, unique: true },
//   classGrade: {
//     type: String,
//     required: true,
//     enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
//   },
//   section: { type: String, required: true, enum: ["A", "B", "C", "D"] },
//   profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" },
//   teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
// }, { timestamps: true });

// module.exports = mongoose.model("Student", studentSchema);

// student-model.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  classGrade: {
    type: String,
    required: true,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  },
  section: { type: String, required: true, enum: ["A", "B", "C", "D"] },
  profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  project: {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  }, // New field to store project details
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);