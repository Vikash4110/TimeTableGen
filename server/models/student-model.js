// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const studentSchema = new mongoose.Schema({
//   childrenName: { type: String, required: true },
//   email: { type: String, required: true, unique: true, lowercase: true },
//   dob: { type: Date, required: true },
//   gender: { 
//     type: String, 
//     required: true, 
//     enum: ['Male', 'Female', 'Other'] 
//   },
//   password: { type: String, required: true },
//   profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: 'Uploads.files' },
//   parentName: { type: String, required: true },
//   parentMobileNumber: { type: String, required: true },
//   role: { type: String, default: 'student' },
// }, { timestamps: true });

// studentSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// studentSchema.methods.comparePassword = async function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// studentSchema.methods.generateToken = function() {
//   return jwt.sign(
//     { userId: this._id, role: 'student' },
//     process.env.JWT_KEY,
//     { expiresIn: '24h' }
//   );
// };

// module.exports = mongoose.model('Student', studentSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const studentSchema = new mongoose.Schema({
  childrenName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  dob: { type: Date, required: true },
  gender: { 
    type: String, 
    required: true, 
    enum: ['Male', 'Female', 'Other'] 
  },
  password: { type: String, required: true },
  profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: 'Uploads.files' },
  parentName: { type: String, required: true },
  parentMobileNumber: { type: String, required: true },
  role: { type: String, default: 'student' },
  subscribed: { type: Boolean, default: false }, // New field
  subscriptionEndDate: { type: Date, default: null }, // New field
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
    { userId: this._id, role: 'student', subscribed: this.subscribed },
    process.env.JWT_KEY,
    { expiresIn: '24h' }
  );
};

module.exports = mongoose.model('Student', studentSchema);