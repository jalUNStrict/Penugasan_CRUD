'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type EventPayload } from '@/lib/api';

interface EventCardProps {
  event: EventPayload;
  onDelete?: () => void;
  onRegister?: () => void;
  isRegistering?: boolean;
  isDeleting?: boolean;
}

export function EventCard({ event, onDelete, onRegister, isRegistering, isDeleting }: EventCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 text-sm text-slate-600">
          <div>
            <span className="font-medium text-slate-900">Kuota:</span> {event.quota}
          </div>
          <div>
            <span className="font-medium text-slate-900">Mulai:</span> {new Date(event.started_at).toLocaleString()}
          </div>
          <div>
            <span className="font-medium text-slate-900">Selesai:</span> {new Date(event.ended_at).toLocaleString()}
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2 flex-wrap">
        {onRegister && (
          <Button variant="secondary" size="sm" onClick={onRegister} disabled={isRegistering}>
            {isRegistering ? 'Mendaftar...' : 'Daftar Event'}
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" size="sm" onClick={onDelete} disabled={isDeleting}>
            {isDeleting ? 'Menghapus...' : 'Hapus Event'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
