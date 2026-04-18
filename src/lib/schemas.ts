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

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  regular_price: z.number().positive("Price must be positive"),
  category_id: z.string().uuid().optional().nullable(),
  short_description: z.string().optional(),
  description: z.string().optional(),
  sale_price: z.number().positive().optional().nullable(),
  sku: z.string().optional(),
  stock_quantity: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  warranty_months: z.number().int().min(0).optional(),
  material: z.string().optional(),
  weight: z.number().positive().optional(),
  fitment_guide: z.string().optional(),
  technical_specification: z.array(z.string()).optional(),
  reviews: z.array(z.string()).optional(),
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
