# Penugasan CRUD Frontend

Aplikasi frontend untuk sistem CRUD dengan autentikasi menggunakan Next.js dan shadcn UI.

## Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Buat file `.env.local` di root folder:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## Features

### Halaman Login
- Form login dengan validasi dari sisi klien
- Menyimpan token ke localStorage
- Redirect ke dashboard setelah login berhasil
- Error handling yang jelas

### Halaman Register
- Form pendaftaran dengan validasi komprehensif:
  - Email format validation
  - Username: 3-20 karakter
  - Password: minimal 8 karakter, harus mengandung huruf besar, huruf kecil, dan angka
  - Konfirmasi password
- Real-time password requirement indicator
- Error handling untuk username yang sudah digunakan
- Redirect ke login page setelah pendaftaran berhasil

### Komponen UI
- Button dari shadcn UI
- Input fields
- Label
- Error messages
- Success messages
- Loading states

## File Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── register/
│   │   └── page.tsx         # Register page
│   ├── dashboard/
│   │   └── page.tsx         # Dashboard page
│   └── globals.css
├── components/
│   ├── auth/
│   │   ├── login-form.tsx   # Login form component
│   │   └── register-form.tsx # Register form component
│   └── ui/
│       ├── button.tsx       # shadcn Button component
│       ├── input.tsx        # shadcn Input component
│       └── label.tsx        # shadcn Label component
├── lib/
│   ├── utils.ts            # Utility functions (cn)
│   ├── api.ts              # API client dengan axios
│   └── validation.ts       # Form validation schemas (Zod)
```

## API Integration

Aplikasi terhubung ke backend API:
- `POST /auth/login` - Login dengan username & password
- `POST /auth/register` - Register dengan email, username & password

Token disimpan di localStorage dan digunakan untuk request yang memerlukan autentikasi.

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
