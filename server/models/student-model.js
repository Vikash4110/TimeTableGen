// // student-model.js
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
//   project: {
//     title: { type: String, default: "" },
//     description: { type: String, default: "" },
//   }, // New field to store project details
// }, { timestamps: true });

// module.exports = mongoose.model("Student", studentSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  semester: { 
    type: String, 
    required: true, 
    enum: ['1', '2', '3', '4', '5', '6', '7', '8']
  },
  group: { 
    type: String, 
    required: true, 
    enum: ['A', 'B', 'C', 'D']
  },
  profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: 'Uploads.files' },
  role: { type: String, default: 'student' },
}, { timestamps: true });

studentSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

studentSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

studentSchema.methods.generateToken = function() {
  return jwt.sign(
    { userId: this._id, role: 'student' },
    process.env.JWT_KEY,
    { expiresIn: '24h' }
  );
};

module.exports = mongoose.model('Student', studentSchema);