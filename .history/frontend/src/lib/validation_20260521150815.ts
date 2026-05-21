import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Email tidak valid' }),
  password: z
    .string()
    .min(1, { message: 'Password harus diisi' }),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name harus diisi' }),
  email: z
    .string()
    .email({ message: 'Email tidak valid' }),
  password: z
    .string()
    .min(8, { message: 'Password minimal 8 karakter' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'Confirm Password harus diisi' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
