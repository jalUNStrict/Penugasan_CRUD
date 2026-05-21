import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Username harus diisi' }),
  password: z
    .string()
    .min(1, { message: 'Password harus diisi' }),
});

export const registerSchema = z.object({
  email: z
    .string()
    .email({ message: 'Format email tidak valid' }),
  username: z
    .string()
    .min(3, { message: 'Username minimal 3 karakter' })
    .max(20, { message: 'Username maksimal 20 karakter' }),
  password: z
    .string()
    .min(8, { message: 'Password minimal 8 karakter' })
    .regex(/[A-Z]/, { message: 'Password harus mengandung huruf besar' })
    .regex(/[a-z]/, { message: 'Password harus mengandung huruf kecil' })
    .regex(/[0-9]/, { message: 'Password harus mengandung angka' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'Konfirmasi password harus diisi' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
