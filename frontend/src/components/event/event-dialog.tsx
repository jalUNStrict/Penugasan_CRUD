'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { eventSchema, type EventFormData } from '@/lib/validation';
import { eventAPI, type EventPayload } from '@/lib/api';

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: EventPayload | null;
  onSuccess: (event: EventPayload) => void;
}

export function EventDialog({ open, onOpenChange, event, onSuccess }: EventDialogProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isEdit = !!event;

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

  useEffect(() => {
    if (event) {
      reset({
        name: event.name,
        description: event.description,
        quota: event.quota,
        started_at: toDatetimeLocal(event.started_at),
        ended_at: toDatetimeLocal(event.ended_at),
      });
    } else {
      reset({
        name: '',
        description: '',
        quota: 1,
        started_at: '',
        ended_at: '',
      });
    }
  }, [event, reset, open]);

  function toDatetimeLocal(iso: string) {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  const onSubmit = async (data: EventFormData) => {
    setLoading(true);
    setErrorMessage('');

    try {
      if (isEdit && event) {
        const response = await eventAPI.updateEvent(event.id, data);
        onSuccess(response.data.data);
      } else {
        const response = await eventAPI.createEvent(data);
        onSuccess(response.data.data);
      }
      onOpenChange(false);
    } catch (error: any) {
      const msg = error.response?.data?.detail || error.response?.data?.message;
      setErrorMessage(msg || (isEdit ? 'Gagal mengupdate event.' : 'Gagal membuat event.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Event' : 'Buat Event Baru'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Ubah data event yang sudah ada.' : 'Isi form untuk menambahkan event baru.'}
          </DialogDescription>
        </DialogHeader>

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

          {errorMessage && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
