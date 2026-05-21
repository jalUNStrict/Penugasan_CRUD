import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10">
        <div className="space-y-6 text-center">
          <div>
            <p className="text-sm text-slate-500">Penugasan CRUD</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900">Aplikasi manajemen dengan autentikasi</h1>
            <p className="mt-3 text-base text-slate-600">Login atau daftar untuk mulai menggunakan aplikasi.</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900">
              Login
            </Link>
            <Link href="/register" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900">
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
