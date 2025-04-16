const Student = require("../models/student-model");
const mongoose = require("mongoose");
const multer = require("multer");
const { Readable } = require("stream");
const { registerSchema } = require("../validators/student-validator");
const { sendEmail } = require("../utils/email");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("profilePicture");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const registerStudent = [
  async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            return reject(new Error(`Multer error: ${err.message}`));
          } else if (err) {
            return reject(new Error(`Upload error: ${err.message}`));
          }
          console.log("Uploaded file:", req.file ? req.file.originalname : "None");
          resolve();
        });
      });
      next();
    } catch (error) {
      console.error("File upload failed:", error.message);
      res.status(400).json({ status: 400, message: "File upload failed", extraDetails: error.message });
    }
  },
  async (req, res, next) => {
    try {
      console.log("Incoming registration data:", JSON.stringify(req.body, null, 2));

      const validatedData = await registerSchema.parseAsync(req.body);
      const { email, rollNo } = validatedData;

      const existingStudent = await Student.findOne({ $or: [{ email }, { rollNo }] });
      if (existingStudent) {
        console.log(`Duplicate found: ${email} or ${rollNo}`);
        return res.status(400).json({ status: 400, message: "Email or roll number already registered", extraDetails: "" });
      }

      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
      let profilePictureId = null;

      if (req.file) {
        const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
        const bufferStream = Readable.from(req.file.buffer);
        profilePictureId = uploadStream.id;

        await new Promise((resolve, reject) => {
          bufferStream
            .pipe(uploadStream)
            .on("error", (err) => reject(err))
            .on("finish", () => resolve());
        });
        console.log("Profile picture uploaded with ID:", profilePictureId);
      }

      const otp = generateOTP();
      await sendEmail(email, "Verify Your Email", `Your OTP for registration is: ${otp}`);
      console.log(`OTP sent to ${email}: ${otp}`);

      const tempStudent = {
        ...validatedData,
        profilePicture: profilePictureId,
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10-minute expiration
      };

      req.app.locals.tempStudents = req.app.locals.tempStudents || {};
      req.app.locals.tempStudents[email] = tempStudent;
      console.log("Stored tempStudent:", JSON.stringify(tempStudent, null, 2));

      res.status(200).json({ status: 200, message: "OTP sent to your email. Please verify.", extraDetails: "" });
    } catch (error) {
      if (error.name === "ZodError") {
        const status = 422;
        const message = "Validation failed";
        const extraDetails = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ");
        console.error(`[${status}] ${message}: ${extraDetails}`);
        return res.status(status).json({ status, message, extraDetails });
      }
      next(error);
    }
  },
];

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const tempStudents = req.app.locals.tempStudents || {};
    const tempStudent = tempStudents[email];

    if (!tempStudent || tempStudent.otp !== otp || Date.now() > tempStudent.expiresAt) {
      console.log(`Invalid OTP attempt for ${email}: ${otp}`);
      return res.status(400).json({ status: 400, message: "Invalid or expired OTP", extraDetails: "" });
    }

    const student = new Student({
      name: tempStudent.name,
      rollNo: tempStudent.rollNo,
      email: tempStudent.email,
      password: tempStudent.password,
      phoneNumber: tempStudent.phoneNumber,
      semester: tempStudent.semester,
      group: tempStudent.group,
      profilePicture: tempStudent.profilePicture,
    });
    await student.save();
    const token = student.generateToken();

    delete req.app.locals.tempStudents[email];
    console.log(`Student registered: ${email}, Token: ${token}`);

    res.status(201).json({ status: 201, message: "Student registered successfully", token });
  } catch (error) {
    next(error);
  }
};

const loginStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student || !(await student.comparePassword(password))) {
      console.log(`Login failed for ${email}`);
      return res.status(401).json({ status: 401, message: "Invalid credentials", extraDetails: "" });
    }
    const token = student.generateToken();
    console.log(`Login successful for ${email}, Token: ${token}`);
    res.json({ status: 200, message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email });
    if (!student) {
      console.log(`Email not found: ${email}`);
      return res.status(404).json({ status: 404, message: "Email not found", extraDetails: "" });
    }

    const otp = generateOTP();
    await sendEmail(email, "Password Reset OTP", `Your OTP to reset your password is: ${otp}`);
    console.log(`Reset OTP sent to ${email}: ${otp}`);

    req.app.locals.resetOTPs = req.app.locals.resetOTPs || {};
    req.app.locals.resetOTPs[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    res.status(200).json({ status: 200, message: "OTP sent to your email for password reset.", extraDetails: "" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const resetOTPs = req.app.locals.resetOTPs || {};
    const resetData = resetOTPs[email];

    if (!resetData || resetData.otp !== otp || Date.now() > resetData.expiresAt) {
      console.log(`Invalid reset OTP attempt for ${email}: ${otp}`);
      return res.status(400).json({ status: 400, message: "Invalid or expired OTP", extraDetails: "" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      console.log(`Student not found for reset: ${email}`);
      return res.status(404).json({ status: 404, message: "Student not found", extraDetails: "" });
    }

    student.password = newPassword;
    await student.save();
    delete req.app.locals.resetOTPs[email];
    console.log(`Password reset successful for ${email}`);

    res.status(200).json({ status: 200, message: "Password reset successfully", extraDetails: "" });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.userId).select("-password");
    if (!student) {
      console.log(`Profile not found for userId: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: "Student not found", extraDetails: "" });
    }
    console.log("Fetched profile data:", JSON.stringify(student.toObject(), null, 2));
    res.json(student);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, semester, group } = req.body;
    const student = await Student.findById(req.user.userId);

    if (!student) {
      console.log(`Student not found for update: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: "Student not found", extraDetails: "" });
    }

    student.name = name || student.name;
    student.email = email || student.email;
    student.phoneNumber = phoneNumber || student.phoneNumber;
    student.semester = semester || student.semester;
    student.group = group || student.group;

    await student.save();
    console.log(`Profile updated for ${student.email}`);
    res.status(200).json({ status: 200, message: "Profile updated successfully", data: student });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerStudent,
  verifyOTP,
  loginStudent,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
};