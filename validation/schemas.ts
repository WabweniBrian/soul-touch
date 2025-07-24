import * as z from "zod";

// User Registration Schema ---------------------------------------------------------------------------------------------------------------
export const userRegistrationSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(3),
  email: z
    .string({ required_error: "Email address is required" })
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),
  firstName: z
    .string({ required_error: "First name is required" })
    .min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z
    .string({ required_error: "Last name is required" })
    .min(1, "Last name is required"),
  department: z
    .string({ required_error: "Department is required" })
    .min(1, "Department is required"),
  phone: z.string().optional(),
});

// Profile Update Schema ---------------------------------------------------------------------------------------------------------------
export const profileUpdateSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(3),
  email: z
    .string({ required_error: "Email address is required" })
    .email("Invalid email address"),
});

// User Login Schema ---------------------------------------------------------------------------------------------------------------
export const userLoginSchema = z.object({
  email: z
    .string({ required_error: "Email address is required" })
    .email("Invalid email address"),
  password: z.string({ required_error: "Password is required" }),
});

// Forgot Password Schema ---------------------------------------------------------------------------------------------------------------
export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email address is required" })
    .email("Invalid email adddress"),
});

// Reset Password Schema ---------------------------------------------------------------------------------------------------------------
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string({ required_error: "New Password is required" })
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string({
      required_error: "Confirm Password is required",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// User Profile Edit Schema ---------------------------------------------------------------------------------------------------------------
export const userProfileSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(3),
  email: z
    .string({ required_error: "Email address is required" })
    .email("Invalid email address"),
});

// Change Password Schema ---------------------------------------------------------------------------------------------------------------
export const changePasswordSchema = z
  .object({
    currentPassword: z.string({
      required_error: "Current Password is required",
    }),
    newPassword: z
      .string({ required_error: "New Password is required" })
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string({
      required_error: "Confirm Password is required",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// User  Schema ---------------------------------------------------------------------------------------------------------------
export const userSchema = z
  .object({
    name: z.string({ required_error: "Name is required" }).min(3),
    email: z
      .string({ required_error: "Email address is required" })
      .email("Invalid email address"),
    role: z.string({ required_error: "Please select a role" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string({
      required_error: "Confirm Password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// User Update Schema ---------------------------------------------------------------------------------------------------------------
export const userUpdateSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(3),
  email: z
    .string({ required_error: "Email address is required" })
    .email("Invalid email address"),
  role: z.string({ required_error: "Please select a role" }),
});

// Notification schema for validation
export const notificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.string().min(1, "Type is required"),
  userId: z.string().optional(),
  isAdmin: z.boolean().default(false),
});

export const staffSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(3),
  email: z
    .string({ required_error: "Email address is required" })
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),
  firstName: z
    .string({ required_error: "First name is required" })
    .min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z
    .string({ required_error: "Last name is required" })
    .min(1, "Last name is required"),
  department: z
    .string({ required_error: "Department is required" })
    .min(1, "Department is required"),
  phone: z.string().optional(),
});

export const staffUpdateSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(3),
  email: z
    .string({ required_error: "Email address is required" })
    .email("Invalid email address"),
  firstName: z
    .string({ required_error: "First name is required" })
    .min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z
    .string({ required_error: "Last name is required" })
    .min(1, "Last name is required"),
  department: z
    .string({ required_error: "Department is required" })
    .min(1, "Department is required"),
  phone: z.string().optional(),
});
