const Joi = require("joi");

// Student validation schema
const studentSchema = Joi.object({
  studentId: Joi.string().alphanum().min(3).max(20).required().messages({
    "string.alphanum": "Student ID must contain only alphanumeric characters",
    "string.min": "Student ID must be at least 3 characters long",
    "string.max": "Student ID must not exceed 20 characters",
  }),

  firstName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      "string.pattern.base": "First name must contain only letters and spaces",
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      "string.pattern.base": "Last name must contain only letters and spaces",
    }),

  email: Joi.string().email().max(100).required(),

  password: Joi.string().min(6).max(128).required(),

  phone: Joi.string()
    .pattern(/^[+]?[\d\s\-\(\)]{10,15}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base": "Phone number format is invalid",
    }),

  dateOfBirth: Joi.date().max("now").optional().allow(null),

  course: Joi.string().min(2).max(100).required(),

  batch: Joi.string().min(2).max(50).required(),

  isActive: Joi.boolean().optional(),
});

// Student update schema (all fields optional except validation rules)
const studentUpdateSchema = Joi.object({
  studentId: Joi.string().alphanum().min(3).max(20).optional(),

  firstName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .optional(),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .optional(),

  email: Joi.string().email().max(100).optional(),

  password: Joi.string().min(6).max(128).optional(),

  phone: Joi.string()
    .pattern(/^[+]?[\d\s\-\(\)]{10,15}$/)
    .optional()
    .allow(""),

  dateOfBirth: Joi.date().max("now").optional().allow(null),

  course: Joi.string().min(2).max(100).optional(),

  batch: Joi.string().min(2).max(50).optional(),

  isActive: Joi.boolean().optional(),
});

// Student login schema
const studentLoginSchema = Joi.object({
  studentId: Joi.string().required().messages({
    "any.required": "Student ID is required",
  }),

  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

// Event validation schema
const eventSchema = Joi.object({
  title: Joi.string().min(2).max(100).optional().allow(""),

  description: Joi.string().min(10).max(1000).required().messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description must not exceed 1000 characters",
  }),

  eventDate: Joi.date().optional().allow(null),

  category: Joi.string()
    .valid("general", "academic", "cultural", "sports", "announcement")
    .optional()
    .default("general"),

  isActive: Joi.boolean().optional().default(true),
});

// Attendance validation schema
const attendanceSchema = Joi.object({
  studentId: Joi.string().required(),

  date: Joi.date().max("now").required(),

  status: Joi.string().valid("present", "absent", "late").required(),

  reason: Joi.string().max(200).optional().allow(""),
});

// Test result validation schema
const testResultSchema = Joi.object({
  studentId: Joi.string().required(),

  testNumber: Joi.number().integer().min(1).max(1000).required(),

  testName: Joi.string().min(2).max(100).required(),

  subject: Joi.string().min(2).max(50).required(),

  maxMarks: Joi.number().min(1).max(1000).required(),

  obtainedMarks: Joi.number()
    .min(0)
    .max(Joi.ref("maxMarks"))
    .required()
    .messages({
      "number.max": "Obtained marks cannot exceed maximum marks",
    }),

  testDate: Joi.date().max("now").required(),

  remarks: Joi.string().max(500).optional().allow(""),
});

// Gallery validation schema
const gallerySchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),

  description: Joi.string().max(500).optional().allow(""),

  category: Joi.string().max(50).optional().allow(""),
});

// Testimonial validation schema
const testimonialSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z\s]+$/)
    .required(),

  college: Joi.string().min(2).max(200).required(),

  message: Joi.string().min(10).max(1000).required(),

  video_link: Joi.string().uri().optional().allow(""),
});

// Download validation schema
const downloadSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),

  description: Joi.string().max(500).optional().allow(""),

  category: Joi.string().max(50).optional().allow(""),
});

// Study material validation schema
const studyMaterialSchema = Joi.object({
  subject: Joi.string().min(2).max(50).required(),

  topic: Joi.string().min(2).max(100).required(),

  videoUrl: Joi.string().uri().required().messages({
    "string.uri": "Video URL must be a valid URL",
  }),

  description: Joi.string().max(1000).optional().allow(""),

  duration: Joi.number()
    .min(1)
    .max(600) // 10 hours max
    .optional(),

  orderIndex: Joi.number().integer().min(0).optional().default(0),
});

// Common ID validation
const idSchema = Joi.object({
  id: Joi.number().integer().min(1).required().messages({
    "number.base": "ID must be a number",
    "number.integer": "ID must be an integer",
    "number.min": "ID must be greater than 0",
  }),
});

module.exports = {
  studentSchema,
  studentUpdateSchema,
  studentLoginSchema,
  eventSchema,
  attendanceSchema,
  testResultSchema,
  gallerySchema,
  testimonialSchema,
  downloadSchema,
  studyMaterialSchema,
  idSchema,
};
