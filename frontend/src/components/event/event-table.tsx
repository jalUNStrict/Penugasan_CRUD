'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type EventPayload } from '@/lib/api';

interface EventTableProps {
  events: EventPayload[];
  onEdit: (event: EventPayload) => void;
  onDelete: (event: EventPayload) => void;
  onAdd: () => void;
  loading?: boolean;
}

export function EventTable({ events, onEdit, onDelete, onAdd, loading }: EventTableProps) {
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return events;
    const q = search.toLowerCase();
    return events.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
    );
  }, [events, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, safePage, rowsPerPage]);

  const exportCSV = () => {
    const headers = ['Name', 'Description', 'Quota', 'Started At', 'Ended At'];
    const rows = events.map((e) => [
      e.name,
      e.description,
      e.quota,
      new Date(e.started_at).toISOString(),
      new Date(e.ended_at).toISOString(),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Search + Export */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Cari event..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-xs"
        />
        <Button variant="outline" onClick={exportCSV}>
          Export Excel
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="max-w-[200px]">Description</TableHead>
              <TableHead className="w-[80px]">Quota</TableHead>
              <TableHead className="w-[160px]">Start</TableHead>
              <TableHead className="w-[160px]">End</TableHead>
              <TableHead className="w-[120px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                  {search ? 'Event tidak ditemukan.' : 'Belum ada event.'}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell className="text-slate-600 truncate max-w-[200px]">
                    {event.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{event.quota}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 text-xs">
                    {new Date(event.started_at).toLocaleDateString('id-ID', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className="text-slate-600 text-xs">
                    {new Date(event.ended_at).toLocaleDateString('id-ID', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(event)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(event)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Bottom: Add + Row per page + Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button onClick={onAdd}>Add</Button>

        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span>Rows per page:</span>
          <Select
            value={String(rowsPerPage)}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="w-16"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </Select>

          <span>
            {filtered.length === 0
              ? '0 of 0'
              : `${(safePage - 1) * rowsPerPage + 1}-${Math.min(safePage * rowsPerPage, filtered.length)} of ${filtered.length}`}
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={safePage <= 1}
            >
              |&lt;
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
            >
              &lt;
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
            >
              &gt;
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage >= totalPages}
            >
              &gt;|
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
