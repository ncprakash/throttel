import { z } from "zod";

export const signUpSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional(),
  parent_id: z.string().uuid().optional().nullable(),
  is_active: z.boolean().optional(),
});

const techSpecItemSchema = z.object({
  diameter: z.string().optional(),
  length: z.string().optional(),
  torque_increase: z.string().optional(),
  power_increase: z.string().optional(),
  color: z.string().optional(),
  finish: z.string().optional(),
}).catchall(z.string().optional()); // Allow any other key-value pairs

// Schema for review objects
const reviewSchema = z.object({
  user: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const productSchema = z.object({
  category_id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  short_description: z.string().optional(),
  description: z.string().optional(),
  regular_price: z.number().positive("Regular price must be positive"),
  sale_price: z.number().positive().nullable().optional(),
  sku: z.string().min(1, "SKU is required"),
  stock_quantity: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  warranty_months: z.number().int().min(0).default(6),
  material: z.string().optional(),
  technical_specification: z.array(techSpecItemSchema).optional(), // ✅ array of objects
  reviews: z.array(reviewSchema).optional(),                       // ✅ array of review objects
  weight: z.number().positive().optional(),
  fitment_guide: z.preprocess(
  (val) => (val === "" ? null : val),
  z.string().nullable().optional()
), // allow null
});
export const adminUserSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
