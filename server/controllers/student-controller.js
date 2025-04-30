// const express = require('express');
// const router = express.Router();
// const Student = require('../models/student-model');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const { Readable } = require('stream');
// const { registerSchema } = require('../validators/student-validator');
// const { sendEmail } = require('../utils/email');
// const { authMiddleware, validate } = require('../middlewares/student-middleware');

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// }).single('profilePicture');

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// const registerStudent = [
//   async (req, res, next) => {
//     try {
//       await new Promise((resolve, reject) => {
//         upload(req, res, (err) => {
//           if (err instanceof multer.MulterError) {
//             return reject(new Error(`Multer error: ${err.message}`));
//           } else if (err) {
//             return reject(new Error(`Upload error: ${err.message}`));
//           }
//           console.log('Uploaded file:', req.file ? req.file.originalname : 'None');
//           resolve();
//         });
//       });
//       next();
//     } catch (error) {
//       console.error('File upload failed:', error.message);
//       res.status(400).json({ status: 400, message: 'File upload failed', extraDetails: error.message });
//     }
//   },
//   async (req, res, next) => {
//     try {
//       console.log('Incoming registration data:', JSON.stringify(req.body, null, 2));

//       const validatedData = await registerSchema.parseAsync(req.body);
//       const { email } = validatedData;

//       const existingStudent = await Student.findOne({ email });
//       if (existingStudent) {
//         console.log(`Duplicate email found: ${email}`);
//         return res.status(400).json({ status: 400, message: 'Email already registered', extraDetails: '' });
//       }

//       const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
//       let profilePictureId = null;

//       if (req.file) {
//         const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
//         const bufferStream = Readable.from(req.file.buffer);
//         profilePictureId = uploadStream.id;

//         await new Promise((resolve, reject) => {
//           bufferStream
//             .pipe(uploadStream)
//             .on('error', (err) => reject(err))
//             .on('finish', () => resolve());
//         });
//         console.log('Profile picture uploaded with ID:', profilePictureId);
//       }

//       const otp = generateOTP();
//       await sendEmail(email, 'Verify Your Email', `Your OTP for registration is: ${otp}`);
//       console.log(`OTP sent to ${email}: ${otp}`);

//       const tempStudent = {
//         ...validatedData,
//         profilePicture: profilePictureId,
//         otp,
//         expiresAt: Date.now() + 10 * 60 * 1000, // 10-minute expiration
//       };

//       req.app.locals.tempStudents = req.app.locals.tempStudents || {};
//       req.app.locals.tempStudents[email] = tempStudent;
//       console.log('Stored tempStudent:', JSON.stringify(tempStudent, null, 2));

//       res.status(200).json({ status: 200, message: 'OTP sent to your email. Please verify.', extraDetails: '' });
//     } catch (error) {
//       if (error.name === 'ZodError') {
//         const status = 422;
//         const message = 'Validation failed';
//         const extraDetails = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
//         console.error(`[${status}] ${message}: ${extraDetails}`);
//         return res.status(status).json({ status, message, extraDetails });
//       }
//       next(error);
//     }
//   },
// ];

// const verifyOTP = async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;
//     const tempStudents = req.app.locals.tempStudents || {};
//     const tempStudent = tempStudents[email];

//     if (!tempStudent || tempStudent.otp !== otp || Date.now() > tempStudent.expiresAt) {
//       console.log(`Invalid OTP attempt for ${email}: ${otp}`);
//       return res.status(400).json({ status: 400, message: 'Invalid or expired OTP', extraDetails: '' });
//     }

//     const student = new Student({
//       childrenName: tempStudent.childrenName,
//       email: tempStudent.email,
//       dob: tempStudent.dob,
//       gender: tempStudent.gender,
//       password: tempStudent.password,
//       profilePicture: tempStudent.profilePicture,
//       parentName: tempStudent.parentName,
//       parentMobileNumber: tempStudent.parentMobileNumber,
//     });
//     await student.save();
//     const token = student.generateToken();

//     delete req.app.locals.tempStudents[email];
//     console.log(`Student registered: ${email}, Token: ${token}`);

//     res.status(201).json({ status: 201, message: 'Student registered successfully', token });
//   } catch (error) {
//     next(error);
//   }
// };

// const loginStudent = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const student = await Student.findOne({ email });
//     if (!student || !(await student.comparePassword(password))) {
//       console.log(`Login failed for ${email}`);
//       return res.status(401).json({ status: 401, message: 'Invalid credentials', extraDetails: '' });
//     }
//     const token = student.generateToken();
//     console.log(`Login successful for ${email}, Token: ${token}`);
//     res.json({ status: 200, message: 'Login successful', token });
//   } catch (error) {
//     next(error);
//   }
// };

// const forgotPassword = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const student = await Student.findOne({ email });
//     if (!student) {
//       console.log(`Email not found: ${email}`);
//       return res.status(404).json({ status: 404, message: 'Email not found', extraDetails: '' });
//     }

//     const otp = generateOTP();
//     await sendEmail(email, 'Password Reset OTP', `Your OTP to reset your password is: ${otp}`);
//     console.log(`Reset OTP sent to ${email}: ${otp}`);

//     req.app.locals.resetOTPs = req.app.locals.resetOTPs || {};
//     req.app.locals.resetOTPs[email] = {
//       otp,
//       expiresAt: Date.now() + 10 * 60 * 1000,
//     };

//     res.status(200).json({ status: 200, message: 'OTP sent to your email for password reset.', extraDetails: '' });
//   } catch (error) {
//     next(error);
//   }
// };

// const resetPassword = async (req, res, next) => {
//   try {
//     const { email, otp, newPassword } = req.body;
//     const resetOTPs = req.app.locals.resetOTPs || {};
//     const resetData = resetOTPs[email];

//     if (!resetData || resetData.otp !== otp || Date.now() > resetData.expiresAt) {
//       console.log(`Invalid reset OTP attempt for ${email}: ${otp}`);
//       return res.status(400).json({ status: 400, message: 'Invalid or expired OTP', extraDetails: '' });
//     }

//     const student = await Student.findOne({ email });
//     if (!student) {
//       console.log(`Student not found for reset: ${email}`);
//       return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
//     }

//     student.password = newPassword;
//     await student.save();
//     delete req.app.locals.resetOTPs[email];
//     console.log(`Password reset successful for ${email}`);

//     res.status(200).json({ status: 200, message: 'Password reset successfully', extraDetails: '' });
//   } catch (error) {
//     next(error);
//   }
// };

// const getProfile = async (req, res, next) => {
//   try {
//     const student = await Student.findById(req.user.userId).select('-password');
//     if (!student) {
//       console.log(`Profile not found for userId: ${req.user.userId}`);
//       return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
//     }
//     console.log('Fetched profile data:', JSON.stringify(student.toObject(), null, 2));
//     res.json(student);
//   } catch (error) {
//     next(error);
//   }
// };

// const updateProfile = async (req, res, next) => {
//   try {
//     const { childrenName, email, dob, gender, parentName, parentMobileNumber } = req.body;
//     const student = await Student.findById(req.user.userId);

//     if (!student) {
//       console.log(`Student not found for update: ${req.user.userId}`);
//       return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
//     }

//     student.childrenName = childrenName || student.childrenName;
//     student.email = email || student.email;
//     student.dob = dob || student.dob;
//     student.gender = gender || student.gender;
//     student.parentName = parentName || student.parentName;
//     student.parentMobileNumber = parentMobileNumber || student.parentMobileNumber;

//     await student.save();
//     console.log(`Profile updated for ${student.email}`);
//     res.status(200).json({ status: 200, message: 'Profile updated successfully', data: student });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   registerStudent,
//   verifyOTP,
//   loginStudent,
//   forgotPassword,
//   resetPassword,
//   getProfile,
//   updateProfile,
// };

const express = require('express');
const router = express.Router();
const Student = require('../models/student-model');
const mongoose = require('mongoose');
const multer = require('multer');
const { Readable } = require('stream');
const { registerSchema } = require('../validators/student-validator');
const { sendEmail } = require('../utils/email');
const { authMiddleware, validate } = require('../middlewares/student-middleware');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single('profilePicture');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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
          console.log('Uploaded file:', req.file ? req.file.originalname : 'None');
          resolve();
        });
      });
      next();
    } catch (error) {
      console.error('File upload failed:', error.message);
      res.status(400).json({ status: 400, message: 'File upload failed', extraDetails: error.message });
    }
  },
  async (req, res, next) => {
    try {
      console.log('Incoming registration data:', JSON.stringify(req.body, null, 2));

      const validatedData = await registerSchema.parseAsync(req.body);
      const { email } = validatedData;

      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        console.log(`Duplicate email found: ${email}`);
        return res.status(400).json({ status: 400, message: 'Email already registered', extraDetails: '' });
      }

      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'Uploads' });
      let profilePictureId = null;

      if (req.file) {
        const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
        const bufferStream = Readable.from(req.file.buffer);
        profilePictureId = uploadStream.id;

        await new Promise((resolve, reject) => {
          bufferStream
            .pipe(uploadStream)
            .on('error', (err) => reject(err))
            .on('finish', () => resolve());
        });
        console.log('Profile picture uploaded with ID:', profilePictureId);
      }

      const otp = generateOTP();
      await sendEmail(email, 'Verify Your Email', `Your OTP for registration is: ${otp}`);
      console.log(`OTP sent to ${email}: ${otp}`);

      const tempStudent = {
        ...validatedData,
        profilePicture: profilePictureId,
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10-minute expiration
      };

      req.app.locals.tempStudents = req.app.locals.tempStudents || {};
      req.app.locals.tempStudents[email] = tempStudent;
      console.log('Stored tempStudent:', JSON.stringify(tempStudent, null, 2));

      res.status(200).json({ status: 200, message: 'OTP sent to your email. Please verify.', extraDetails: '' });
    } catch (error) {
      if (error.name === 'ZodError') {
        const status = 422;
        const message = 'Validation failed';
        const extraDetails = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
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
      return res.status(400).json({ status: 400, message: 'Invalid or expired OTP', extraDetails: '' });
    }

    const student = new Student({
      childrenName: tempStudent.childrenName,
      email: tempStudent.email,
      dob: tempStudent.dob,
      gender: tempStudent.gender,
      password: tempStudent.password,
      profilePicture: tempStudent.profilePicture,
      parentName: tempStudent.parentName,
      parentMobileNumber: tempStudent.parentMobileNumber,
      subscribed: false,
    });
    await student.save();
    const token = student.generateToken();

    delete req.app.locals.tempStudents[email];
    console.log(`Student registered: ${email}, Token: ${token}`);

    res.status(201).json({ status: 201, message: 'Student registered successfully', token });
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
      return res.status(401).json({ status: 401, message: 'Invalid credentials', extraDetails: '' });
    }
    const token = student.generateToken();
    console.log(`Login successful for ${email}, Token: ${token}`);
    res.json({ status: 200, message: 'Login successful', token, subscribed: student.subscribed });
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
      return res.status(404).json({ status: 404, message: 'Email not found', extraDetails: '' });
    }

    const otp = generateOTP();
    await sendEmail(email, 'Password Reset OTP', `Your OTP to reset your password is: ${otp}`);
    console.log(`Reset OTP sent to ${email}: ${otp}`);

    req.app.locals.resetOTPs = req.app.locals.resetOTPs || {};
    req.app.locals.resetOTPs[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    res.status(200).json({ status: 200, message: 'OTP sent to your email for password reset.', extraDetails: '' });
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
      return res.status(400).json({ status: 400, message: 'Invalid or expired OTP', extraDetails: '' });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      console.log(`Student not found for reset: ${email}`);
      return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
    }

    student.password = newPassword;
    await student.save();
    delete req.app.locals.resetOTPs[email];
    console.log(`Password reset successful for ${email}`);

    res.status(200).json({ status: 200, message: 'Password reset successfully', extraDetails: '' });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.userId).select('-password');
    if (!student) {
      console.log(`Profile not found for userId: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
    }
    console.log('Fetched profile data:', JSON.stringify(student.toObject(), null, 2));
    res.json(student);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { childrenName, email, dob, gender, parentName, parentMobileNumber } = req.body;
    const student = await Student.findById(req.user.userId);

    if (!student) {
      console.log(`Student not found for update: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
    }

    student.childrenName = childrenName || student.childrenName;
    student.email = email || student.email;
    student.dob = dob || student.dob;
    student.gender = gender || student.gender;
    student.parentName = parentName || student.parentName;
    student.parentMobileNumber = parentMobileNumber || student.parentMobileNumber;

    await student.save();
    console.log(`Profile updated for ${student.email}`);
    res.status(200).json({ status: 200, message: 'Profile updated successfully', data: student });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    console.log("Creating order for user:", req.user);
    console.log("Razorpay instance:", {
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET ? "[REDACTED]" : undefined,
    });

    const student = await Student.findById(req.user.userId);
    if (!student) {
      console.log(`Student not found for userId: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
    }
    if (student.subscribed && student.subscriptionEndDate > new Date()) {
      console.log(`Already subscribed: ${student.email}`);
      return res.status(400).json({ status: 400, message: 'Already subscribed', extraDetails: '' });
    }

    const shortId = student._id.toString().slice(0, 8); // First 8 chars of _id
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const receipt = `rcpt_${shortId}_${timestamp}`; // e.g., rcpt_681075eb_123456

    const options = {
      amount: 10000, // ₹100 in paise
      currency: 'INR',
      receipt: receipt,
    };
    console.log("Order options:", options);

    // Retry logic for transient server errors
    let order;
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        order = await razorpay.orders.create(options);
        console.log(`Order created for ${student.email}: ${order.id}`);
        break; // Exit loop on success
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, {
          statusCode: error.statusCode,
          error: error.error,
          message: error.message,
        });
        if (error.statusCode === 500 && attempt < maxRetries) {
          console.warn(`Attempt ${attempt} failed with SERVER_ERROR. Retrying...`);
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
          continue;
        }
        throw error; // Rethrow if not retryable or max retries reached
      }
    }

    res.json({ status: 200, orderId: order.id, amount: options.amount, currency: options.currency });
  } catch (error) {
    console.error("Order creation failed:", {
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode,
      errorDetails: error.error,
    });
    const statusCode = error.statusCode || 500;
    const errorMessage = error.error?.description || error.message || 'Unknown error';
    res.status(statusCode).json({
      status: statusCode,
      message: 'Failed to create order',
      extraDetails: errorMessage,
      errorDetails: error.error || error,
    });
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const student = await Student.findById(req.user.userId);
    if (!student) {
      console.log(`Student not found for userId: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.log(`Invalid payment signature for ${student.email}`);
      return res.status(400).json({ status: 400, message: 'Invalid payment signature', extraDetails: '' });
    }

    student.subscribed = true;
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1-month subscription
    student.subscriptionEndDate = endDate;
    await student.save();

    console.log(`Payment verified and subscription activated for ${student.email}`);
    res.json({ status: 200, message: 'Payment verified and subscription activated' });
  } catch (error) {
    console.error('Payment verification failed:', error.message);
    res.status(500).json({ status: 500, message: 'Payment verification failed', extraDetails: error.message });
  }
};

const getSubscriptionStatus = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.userId);
    if (!student) {
      console.log(`Student not found for userId: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
    }
    const isSubscribed = student.subscribed && student.subscriptionEndDate > new Date();
    res.json({ status: 200, subscribed: isSubscribed, subscriptionEndDate: student.subscriptionEndDate });
  } catch (error) {
    console.error('Subscription status check failed:', error.message);
    res.status(500).json({ status: 500, message: 'Failed to check subscription status', extraDetails: error.message });
  }
};

const dashboard = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.userId).select('childrenName email parentName subscribed subscriptionEndDate');
    if (!student) {
      console.log(`Student not found for userId: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
    }

    // Check subscription status
    const isSubscribed = student.subscribed && student.subscriptionEndDate > new Date();
    if (!isSubscribed) {
      console.log(`Unauthorized dashboard access attempt by ${student.email}: No active subscription`);
      return res.status(403).json({
        status: 403,
        message: 'Access denied: Active subscription required',
        extraDetails: 'Please purchase a subscription to access the dashboard.',
      });
    }

    console.log(`Dashboard access granted for ${student.email}`);
    res.json({
      status: 200,
      message: 'Welcome to the Student Dashboard',
      data: {
        childrenName: student.childrenName,
        email: student.email,
        parentName: student.parentName,
        subscriptionEndDate: student.subscriptionEndDate,
      },
    });
  } catch (error) {
    console.error('Dashboard access failed:', error.message);
    res.status(500).json({ status: 500, message: 'Failed to access dashboard', extraDetails: error.message });
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
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
  dashboard,
};