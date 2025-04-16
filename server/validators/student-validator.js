const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  rollNo: z.string().min(1, 'Roll number is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  semester: z.enum(['1', '2', '3', '4', '5', '6', '7', '8'], { message: 'Invalid semester' }),
  group: z.enum(['A', 'B', 'C', 'D'], { message: 'Invalid group' }),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

module.exports = { registerSchema, loginSchema };