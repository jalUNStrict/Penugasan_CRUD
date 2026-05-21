'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { eventSchema, type EventFormData } from '@/lib/validation';
import { eventAPI, type EventPayload } from '@/lib/api';

interface EventFormProps {
  onCreated?: (event: EventPayload) => void;
}

export function EventForm({ onCreated }: EventFormProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      description: '',
      quota: 1,
      started_at: '',
      ended_at: '',
    },
  });

  const onSubmit = async (data: EventFormData) => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await eventAPI.createEvent(data);
      const createdEvent = response.data.data;
      setSuccessMessage('Event berhasil dibuat.');
      reset();
      onCreated?.(createdEvent);
    } catch (error: any) {
      const serverMessage = error.response?.data?.detail || error.response?.data?.message;
      setErrorMessage(serverMessage || 'Gagal membuat event. Pastikan Anda memiliki akses yang valid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-950">Buat Event Baru</h2>
        <p className="text-sm text-slate-600">Hanya admin yang dapat membuat event baru. Jika bukan admin, Anda akan menerima pesan akses ditolak.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Event</Label>
          <Input id="name" placeholder="Contoh: Seminar AI" {...register('name')} disabled={loading} />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Input id="description" placeholder="Deskripsi singkat" {...register('description')} disabled={loading} />
          {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="quota">Kuota</Label>
            <Input id="quota" type="number" min={1} {...register('quota', { valueAsNumber: true })} disabled={loading} />
            {errors.quota && <p className="text-sm text-red-600">{errors.quota.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="started_at">Mulai</Label>
            <Input id="started_at" type="datetime-local" {...register('started_at')} disabled={loading} />
            {errors.started_at && <p className="text-sm text-red-600">{errors.started_at.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ended_at">Selesai</Label>
          <Input id="ended_at" type="datetime-local" {...register('ended_at')} disabled={loading} />
          {errors.ended_at && <p className="text-sm text-red-600">{errors.ended_at.message}</p>}
        </div>

        {errorMessage && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}
        {successMessage && <div className="rounded-md border border-green-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</div>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Event'}
        </Button>
      </form>
    </div>
  );
}
