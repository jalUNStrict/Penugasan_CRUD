export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Penugasan CRUD</h1>
        <p className="text-gray-600 mb-8">Aplikasi manajemen dengan autentikasi</p>
        <div className="space-x-4">
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800"
          >
            Login
          </a>
          <a
            href="/register"
            className="inline-block px-6 py-2 bg-white text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50"
          >
            Daftar
          </a>
        </div>
      </div>
    </div>
  );
}
