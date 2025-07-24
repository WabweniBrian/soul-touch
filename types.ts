import {
  changePasswordSchema,
  forgotPasswordSchema,
  notificationSchema,
  resetPasswordSchema,
  staffSchema,
  staffUpdateSchema,
  userLoginSchema,
  userProfileSchema,
  userRegistrationSchema,
  userSchema,
  userUpdateSchema,
} from "@/validation/schemas";
import { UserRole } from "@prisma/client";
import * as z from "zod";

// --------------------------- FORMS TYPES--------------------------------------------------------------------------------------
export type UserSchemaType = z.infer<typeof userSchema>;
export type UserUpdateSchemaType = z.infer<typeof userUpdateSchema>;
export type UserRegistrationSchemaType = z.infer<typeof userRegistrationSchema>;
export type UserLoginSchemaType = z.infer<typeof userLoginSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
export type UserProfileSchemaType = z.infer<typeof userProfileSchema>;
export type PasswordChangeSchemaType = z.infer<typeof changePasswordSchema>;
export type NotificationSchemaType = z.infer<typeof notificationSchema>;
export type StaffSchemaType = z.infer<typeof staffSchema>;
export type StaffUpdateSchemaType = z.infer<typeof staffUpdateSchema>;

export type SessionUser = {
  name: string;
  id: string;
  email: string;
  image: string | null;
  role: UserRole;
  isActive: boolean;
} | null;
