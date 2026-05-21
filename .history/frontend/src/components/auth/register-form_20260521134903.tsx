'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema, type RegisterFormData } from '@/lib/validation';
import { authAPI } from '@/lib/api';
import Link from 'next/link';

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await authAPI.register(data.email, data.username, data.password);
      
      setSuccessMessage('Pendaftaran berhasil! Silakan login.');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Pendaftaran gagal. Silakan coba lagi.';
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Masukkan email Anda"
          {...register('email')}
          disabled={loading}
        />
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}
      </div>

      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="Masukkan username Anda"
          {...register('username')}
          disabled={loading}
        />
        {errors.username && (
          <span className="text-sm text-red-500">{errors.username.message}</span>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Masukkan password Anda"
          {...register('password')}
          disabled={loading}
        />
        {errors.password && (
          <span className="text-sm text-red-500">{errors.password.message}</span>
        )}
        {password && (
          <div className="mt-2 text-xs space-y-1">
            <p className={password.length >= 8 ? 'text-green-600' : 'text-gray-600'}>
              ✓ Minimal 8 karakter
            </p>
            <p className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-600'}>
              ✓ Mengandung huruf besar
            </p>
            <p className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-600'}>
              ✓ Mengandung huruf kecil
            </p>
            <p className={/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-600'}>
              ✓ Mengandung angka
            </p>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Masukkan ulang password Anda"
          {...register('confirmPassword')}
          disabled={loading}
        />
        {errors.confirmPassword && (
          <span className="text-sm text-red-500">{errors.confirmPassword.message}</span>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Sedang mendaftar...' : 'Daftar'}
      </Button>

      <p className="text-center text-sm">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login di sini
        </Link>
      </p>
    </form>
  );
}
