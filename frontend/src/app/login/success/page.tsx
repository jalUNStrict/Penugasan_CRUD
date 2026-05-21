'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';

export default function LoginSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    adminAPI.checkRole()
      .then(() => router.push('/events/admin'))
      .catch((err) => {
        if (err.response?.status === 403) {
          router.push('/events');
        } else {
          router.push('/login');
        }
      });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-500">Mengalihkan...</p>
    </div>
  );
}
