'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventTable } from '@/components/event/event-table';
import { EventDialog } from '@/components/event/event-dialog';
import { authAPI, eventAPI, type EventPayload } from '@/lib/api';

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventPayload | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadEvents = useCallback(async () => {
    try {
      const response = await eventAPI.getEvents();
      setEvents(response.data.data.events);
    } catch (error: any) {
      const detail = error.response?.data?.detail || error.response?.data?.message;
      setErrorMessage(detail || 'Gagal memuat data event.');
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadEvents();
  }, [loadEvents, router]);

  const handleAdd = () => {
    setEditingEvent(null);
    setDialogOpen(true);
  };

  const handleEdit = (event: EventPayload) => {
    setEditingEvent(event);
    setDialogOpen(true);
  };

  const handleDelete = async (event: EventPayload) => {
    if (deletingId === event.id) return;
    setDeletingId(event.id);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await eventAPI.deleteEvent(event.id);
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
      setSuccessMessage(`Event "${event.name}" berhasil dihapus.`);
    } catch (error: any) {
      const detail = error.response?.data?.detail || error.response?.data?.message;
      setErrorMessage(detail || 'Gagal menghapus event.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDialogSuccess = (event: EventPayload) => {
    setEvents((prev) => {
      const idx = prev.findIndex((e) => e.id === event.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = event;
        return updated;
      }
      return [event, ...prev];
    });
    setSuccessMessage(editingEvent ? 'Event berhasil diperbarui.' : 'Event baru berhasil ditambahkan.');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4">
        {/* Header */}
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Admin Event Management</CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                Kelola event — tambah, edit, hapus, dan export data event.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Dashboard
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  localStorage.removeItem('access_token');
                  router.push('/login');
                }}
              >
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Messages */}
        {errorMessage && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="text-red-700 py-3">{errorMessage}</CardContent>
          </Card>
        )}
        {successMessage && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="text-emerald-700 py-3">{successMessage}</CardContent>
          </Card>
        )}

        {/* Table */}
        <EventTable
          events={events}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          loading={loading}
        />
      </div>

      {/* Dialog */}
      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={editingEvent}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
}
