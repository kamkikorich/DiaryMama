---
title: Diary Mama - Design Specification
date: 2026-03-26
status: approved
---

# Diary Mama - Design Specification

## Ringkasan

Migrasi sistem "Diari Rawatan & Perbelanjaan Mama" dari Google Apps Script ke stack moden dengan Next.js, Supabase, dan Google Drive.

## Matlamat

- Mobile-first web application yang boleh dipasang sebagai PWA
- Authentication ringkas dengan passcode yang dikongsi
- Real-time sync data merentas devices
- Storage gambar di Google Drive (15GB percuma)
- Offline capability

## Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP (VERCEL)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Diari     │  │ Perbelanjaan│  │       Galeri        │  │
│  │  (CRUD)     │  │   (CRUD)    │  │  (CRUD + Upload)    │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼────────────────┼───────────────────┼──────────────┘
          │                │                   │
          ▼                ▼                   ▼
┌─────────────────────────────────────┐  ┌──────────────────┐
│           SUPABASE                   │  │   GOOGLE DRIVE   │
│  ┌─────────┐ ┌─────────┐ ┌────────┐ │  │   (Gambar)       │
│  │  Auth   │ │   DB    │ │Storage │ │  │   15GB Free      │
│  │(Passcode)│ │Postgres │ │(Backup)│ │  │                  │
│  └─────────┘ └─────────┘ └────────┘ │  │  Folder ID:      │
└─────────────────────────────────────┘  │  1cPf8Omfp5UMk-  │
                                         │  pY0c4-cxoC8gZ0d │
                                         │  Nupd            │
                                         └──────────────────┘
```

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | TailwindCSS + shadcn/ui |
| Database | Supabase PostgreSQL |
| Auth | Custom Passcode via Supabase |
| File Storage | Google Drive API |
| PWA | next-pwa |
| Deployment | Vercel |

## Database Schema

### Tables

```sql
-- Users (Ahli keluarga)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(50) NOT NULL UNIQUE,
  role VARCHAR(20) DEFAULT 'adik-beradik',
  status VARCHAR(20) DEFAULT 'Aktif',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default users
INSERT INTO users (nama, role) VALUES
  ('Walter', 'adik-beradik'),
  ('Marius', 'adik-beradik'),
  ('Adrian', 'adik-beradik'),
  ('Oswald', 'adik-beradik'),
  ('Brenda', 'adik-beradik'),
  ('Justinah', 'pengurus');

-- Diari Rawatan
CREATE TABLE diary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  tarikh DATE NOT NULL,
  masa TIME,
  lokasi VARCHAR(100),
  status_kejadian VARCHAR(100),
  catatan TEXT,
  pautan_dokumen VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Perbelanjaan
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  jenis VARCHAR(20) NOT NULL CHECK (jenis IN ('Masuk', 'Keluar')),
  jumlah DECIMAL(12,2) NOT NULL,
  nota TEXT,
  pautan_resit VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Galeri
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  keterangan TEXT,
  tags VARCHAR(200),
  pautan_gambar VARCHAR(500),
  file_id VARCHAR(100), -- Google Drive file ID
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Config (Passcode & settings)
CREATE TABLE config (
  key VARCHAR(50) PRIMARY KEY,
  value TEXT NOT NULL
);

-- Insert default passcode
INSERT INTO config (key, value) VALUES ('passcode', 'mama1234');
```

### Indexes

```sql
CREATE INDEX idx_diary_user ON diary(user_id);
CREATE INDEX idx_diary_tarikh ON diary(tarikh DESC);
CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_expenses_created ON expenses(created_at DESC);
CREATE INDEX idx_gallery_created ON gallery(created_at DESC);
```

## Authentication Flow

```
┌─────────────────┐
│   User Input    │
│   Passcode      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Verify dengan │
│   config table  │
└────────┬────────┘
         │
    ┌────┴────┐
    │ Match?  │
    └────┬────┘
         │
    ┌────┴────┐
    │         │
   Yes        No
    │         │
    ▼         ▼
┌───────┐  ┌────────┐
│Create │  │ Error  │
│Session│  │ Message│
└───┬───┘  └────────┘
    │
    ▼
┌───────────────┐
│ Set Cookie    │
│ (7 days)      │
│ + Remember Me │
└───────────────┘
```

## Project Structure

```
diary-mama/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Login page
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── diary/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── expenses/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── gallery/
│   │       ├── page.tsx
│   │       └── new/
│   │           └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   └── bottom-nav.tsx
│   │   ├── diary/
│   │   │   ├── diary-form.tsx
│   │   │   └── diary-card.tsx
│   │   ├── expenses/
│   │   │   ├── expense-form.tsx
│   │   │   ├── expense-card.tsx
│   │   │   └── balance-display.tsx
│   │   └── gallery/
│   │       ├── image-grid.tsx
│   │       └── image-upload.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── queries.ts
│   │   ├── google-drive/
│   │   │   └── client.ts
│   │   └── auth.ts
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-diary.ts
│   │   ├── use-expenses.ts
│   │   └── use-gallery.ts
│   │
│   └── types/
│       └── index.ts
│
├── public/
│   ├── manifest.json
│   └── icons/
│
├── .env.local
├── next.config.js
├── tailwind.config.ts
└── package.json
```

## Google Drive Integration

### Upload Flow

```
1. User select image
2. Get access token via Service Account
3. Upload to folder (ID: 1cPf8Omfp5UMk-pY0c4-cxoC8gZ0dNupd)
4. Set file permission to "anyone with link"
5. Get webContentLink
6. Save to gallery table
```

### Service Account Setup

File JSON credentials mengandungi:
- `client_email`
- `private_key`
- `project_id`

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://jnnvarcrdwrrrbavquyg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Google Drive
GOOGLE_DRIVE_FOLDER_ID=1cPf8Omfp5UMk-pY0c4-cxoC8gZ0dNupd
GOOGLE_SERVICE_ACCOUNT_EMAIL=<from-json>
GOOGLE_PRIVATE_KEY=<from-json>

# Auth
AUTH_SECRET=<random-32-chars>
```

## Features

### 1. Dashboard
- Jumlah baki semasa
- 5 entri diari terkini
- 6 gambar terbaru
- Quick action buttons

### 2. Diari
- CRUD entries
- Filter by tarikh, nama
- Search dalam catatan
- Link dokumen (optional)

### 3. Perbelanjaan
- CRUD entries
- Auto-kira baki
- Filter by bulan
- Link resit (optional)

### 4. Galeri
- Grid view gambar
- Upload ke Google Drive
- Filter by tags
- Lightbox preview

## Security

- Passcode disimpan hashed di database (bcrypt)
- Session via HTTP-only cookies
- RLS policies di Supabase
- Service Account untuk Google Drive (tiapa exposed credentials)

## Deployment

1. Push ke GitHub
2. Connect ke Vercel
3. Set environment variables
4. Deploy

## Migration Plan

1. Setup Supabase tables
2. Setup Next.js project
3. Implement authentication
4. Implement CRUD features
5. Integrate Google Drive
6. Setup PWA
7. Deploy to Vercel
8. Migrate data lama (optional)