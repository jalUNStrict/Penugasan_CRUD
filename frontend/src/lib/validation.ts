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

export const eventSchema = z.object({
  name: z.string().min(1, { message: 'Nama event harus diisi' }),
  description: z.string().min(1, { message: 'Deskripsi harus diisi' }),
  quota: z.number().min(1, { message: 'Kuota harus lebih besar dari 0' }),
  started_at: z.string().min(1, { message: 'Tanggal mulai harus diisi' }),
  ended_at: z.string().min(1, { message: 'Tanggal selesai harus diisi' }),
}).refine((data) => new Date(data.ended_at) > new Date(data.started_at), {
  message: 'Tanggal selesai harus setelah tanggal mulai',
  path: ['ended_at'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
