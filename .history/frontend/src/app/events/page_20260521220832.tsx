'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { authAPI, eventAPI, registrationAPI, type AccountProfile, type EventPayload } from '@/lib/api';

export default function UserEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventPayload[]>([]);
  const [currentUser, setCurrentUser] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const load = async () => {
      try {
        const [userRes, eventsRes] = await Promise.all([
          authAPI.me(),
          eventAPI.getEvents(),
        ]);
        setCurrentUser(userRes.data);
        setEvents(eventsRes.data.data.events);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem('access_token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const handleRegister = async (eventId: number) => {
    if (!currentUser) return;
    setRegisteringId(eventId);
    setMessage(null);

    try {
      await registrationAPI.register(currentUser.user_id, eventId);
      setMessage({ type: 'success', text: 'Pendaftaran event berhasil!' });
    } catch (error: any) {
      const detail = error.response?.data?.detail || error.response?.data?.message;
      setMessage({ type: 'error', text: detail || 'Gagal mendaftar event.' });
    } finally {
      setRegisteringId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-6 px-4">
        {/* Header */}
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Daftar Event</CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                Pilih event yang tersedia dan lakukan registrasi.
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

        {/* Message feedback */}
        {message && (
          <Card
            className={
              message.type === 'success'
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-red-200 bg-red-50'
            }
          >
            <CardContent
              className={
                (message.type === 'success' ? 'text-emerald-700' : 'text-red-700') + ' py-3'
              }
            >
              {message.text}
            </CardContent>
          </Card>
        )}

        {/* Event List */}
        {events.length === 0 ? (
          <Card>
            <CardContent className="text-center text-slate-500 py-8">
              Belum ada event tersedia.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                    <Badge variant="secondary">{event.quota}</Badge>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2">{event.description}</p>
                </CardHeader>
                <CardContent className="flex-1 space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-900">Mulai:</span>
                    <span>{new Date(event.started_at).toLocaleDateString('id-ID', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-900">Selesai:</span>
                    <span>{new Date(event.ended_at).toLocaleDateString('id-ID', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}</span>
                  </div>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button
                    className="w-full"
                    onClick={() => handleRegister(event.id)}
                    disabled={registeringId === event.id}
                  >
                    {registeringId === event.id ? 'Mendaftarkan...' : 'Register'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
