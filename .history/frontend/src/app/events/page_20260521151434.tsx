'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventForm } from '@/components/event/event-form';
import { EventCard } from '@/components/event/event-card';
import { authAPI, eventAPI, registrationAPI, type AccountProfile, type EventPayload } from '@/lib/api';

export default function EventsPage() {
  const [events, setEvents] = useState<EventPayload[]>([]);
  const [currentUser, setCurrentUser] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeRegisterId, setActiveRegisterId] = useState<number | null>(null);
  const [activeDeleteId, setActiveDeleteId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setErrorMessage('Anda harus login untuk mengakses halaman event.');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setErrorMessage('');

      try {
        const [userResponse, eventsResponse] = await Promise.all([
          authAPI.me(),
          eventAPI.getEvents(),
        ]);

        setCurrentUser(userResponse.data);
        setEvents(eventsResponse.data.data.events);
      } catch (error: any) {
        const detail = error.response?.data?.detail || error.response?.data?.message;
        setErrorMessage(detail || 'Gagal memuat data event.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshEvents = async () => {
    try {
      const response = await eventAPI.getEvents();
      setEvents(response.data.data.events);
    } catch (error: any) {
      const detail = error.response?.data?.detail || error.response?.data?.message;
      setErrorMessage(detail || 'Gagal memuat ulang daftar event.');
    }
  };

  const handleEventCreated = (event: EventPayload) => {
    setEvents((current) => [event, ...current]);
    setSuccessMessage('Event baru berhasil ditambahkan.');
  };

  const handleDelete = async (eventId: number) => {
    setActiveDeleteId(eventId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await eventAPI.deleteEvent(eventId);
      setEvents((current) => current.filter((event) => event.id !== eventId));
      setSuccessMessage('Event berhasil dihapus.');
    } catch (error: any) {
      const detail = error.response?.data?.detail || error.response?.data?.message;
      setErrorMessage(detail || 'Gagal menghapus event.');
    } finally {
      setActiveDeleteId(null);
    }
  };

  const handleRegister = async (eventId: number) => {
    if (!currentUser) {
      setErrorMessage('User belum dikenali. Silakan login ulang.');
      return;
    }

    setActiveRegisterId(eventId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await registrationAPI.register(currentUser.id, eventId);
      setSuccessMessage('Pendaftaran event berhasil.');
    } catch (error: any) {
      const detail = error.response?.data?.detail || error.response?.data?.message;
      setErrorMessage(detail || 'Gagal mendaftar event.');
    } finally {
      setActiveRegisterId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Kelola Event</h1>
            <p className="text-sm text-slate-600">Lihat daftar event, buat event baru, dan daftarkan diri Anda ke event yang tersedia.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>Kembali ke Dashboard</Button>
            <Button variant="ghost" onClick={() => { localStorage.removeItem('access_token'); window.location.href = '/login'; }}>Logout</Button>
          </div>
        </div>

        {errorMessage && (
          <Card className="border-red-200 bg-red-50 text-red-700">
            <CardContent>{errorMessage}</CardContent>
          </Card>
        )}

        {successMessage && (
          <Card className="border-emerald-200 bg-emerald-50 text-emerald-700">
            <CardContent>{successMessage}</CardContent>
          </Card>
        )}

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <EventForm onCreated={handleEventCreated} />

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">Daftar Event</h2>
                  <p className="text-sm text-slate-600">Semua user yang sudah login dapat melihat daftar event.</p>
                </div>
                <Button variant="secondary" size="sm" onClick={refreshEvents}>Segarkan</Button>
              </div>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-slate-700">Memuat event...</div>
            ) : events.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-slate-700">Tidak ada event untuk ditampilkan.</div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onRegister={() => handleRegister(event.id)}
                    onDelete={() => handleDelete(event.id)}
                    isRegistering={activeRegisterId === event.id}
                    isDeleting={activeDeleteId === event.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
