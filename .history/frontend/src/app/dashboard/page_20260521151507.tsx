export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
            <p className="text-gray-600">Anda telah berhasil login!</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => {
                window.location.href = '/events';
              }}
              className="px-6 py-3 bg-slate-900 text-white rounded-md hover:bg-slate-800"
            >
              Kelola Event
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('access_token');
                window.location.href = '/login';
              }}
              className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
