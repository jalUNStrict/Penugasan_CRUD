import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Login successful</h1>
        <p className="mt-3 text-sm text-slate-600">You have logged in successfully.</p>
        <div className="mt-6">
          <Link href="/dashboard">
            <Button className="w-full">Go to dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
