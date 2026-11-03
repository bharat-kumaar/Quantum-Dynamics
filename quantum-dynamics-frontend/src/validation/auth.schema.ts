import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Valid corporate email required.' }),
  password: z.string().min(1, { message: 'Access key is required.' }),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, { message: 'Full legal name is required.' }),
  email: z.string().trim().email({ message: 'Valid corporate email required.' }),
  password: z.string().min(6, { message: 'Access key must be at least 6 characters.' }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Access keys do not match.",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email({ message: 'Valid corporate email required.' }),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Access key must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Access keys do not match.',
  path: ['confirmPassword'],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
