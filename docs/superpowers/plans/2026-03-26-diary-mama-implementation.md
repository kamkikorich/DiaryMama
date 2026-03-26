# Diary Mama Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first PWA for family diary, expenses, and gallery with Next.js, Supabase, and Google Drive.

**Architecture:** Next.js 14 App Router dengan Supabase PostgreSQL untuk data, custom passcode authentication, dan Google Drive untuk storage gambar.

**Tech Stack:** Next.js 14, TailwindCSS, shadcn/ui, Supabase, Google Drive API, next-pwa

---

## File Structure

```
diary-mama/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Login
│   │   ├── (authenticated)/            # Protected routes
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── diary/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   ├── expenses/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   └── gallery/
│   │   │       ├── page.tsx
│   │   │       └── new/page.tsx
│   │   └── api/
│   │       ├── auth/login/route.ts
│   │       ├── auth/logout/route.ts
│   │       └── upload/route.ts
│   │
│   ├── components/
│   │   ├── ui/                         # shadcn/ui
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   └── bottom-nav.tsx
│   │   ├── diary/
│   │   │   ├── diary-form.tsx
│   │   │   └── diary-card.tsx
│   │   ├── expenses/
│   │   │   ├── expense-form.tsx
│   │   │   ├── expense-list.tsx
│   │   │   └── balance-card.tsx
│   │   └── gallery/
│   │       ├── image-grid.tsx
│   │       └── image-upload.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── queries.ts
│   │   ├── google-drive.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   └── use-toast.ts
│   │
│   └── types/
│       └── index.ts
│
├── public/
│   ├── manifest.json
│   ├── icon-192.png
│   └── icon-512.png
│
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Phase 1: Project Setup

### Task 1.1: Initialize Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `.env.local`
- Create: `.gitignore`

- [ ] **Step 1: Create project directory and initialize**

```bash
cd D:\DiaryRawatanMama
mkdir -p src/app src/components/ui src/components/layout src/components/diary src/components/expenses src/components/gallery src/lib/supabase src/hooks src/types public
```

- [ ] **Step 2: Create package.json**

```json
{
  "name": "diary-mama",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.42.0",
    "@supabase/ssr": "^0.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.358.0",
    "googleapis": "^134.0.0",
    "jose": "^5.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.0"
  }
}
```

- [ ] **Step 3: Create next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['drive.google.com', 'lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 6: Create postcss.config.js**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 7: Create .env.local**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://jnnvarcrdwrrrbavquyg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpubnZhcmNyZHdycnJiYXZxdXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjExNTQsImV4cCI6MjA5MDA5NzE1NH0.w2-EGOjMJG7csUcykDtjdzSAZ8hkTZodw0WIN2C_u_g

# Google Drive
GOOGLE_DRIVE_FOLDER_ID=1cPf8Omfp5UMk-pY0c4-cxoC8gZ0dNupd
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=

# Auth
AUTH_SECRET=diary-mama-secret-key-change-in-production
```

- [ ] **Step 8: Create .gitignore**

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 9: Install dependencies**

```bash
npm install
```

- [ ] **Step 10: Commit**

```bash
git init
git add .
git commit -m "chore: initialize Next.js project with TailwindCSS"
```

---

### Task 1.2: Create Types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Create types file**

```typescript
// src/types/index.ts

export interface User {
  id: string
  nama: string
  role: string
  status: string
  created_at: string
}

export interface Diary {
  id: string
  user_id: string | null
  tarikh: string
  masa: string | null
  lokasi: string | null
  status_kejadian: string | null
  catatan: string | null
  pautan_dokumen: string | null
  created_at: string
  updated_at: string
  users?: User
}

export interface Expense {
  id: string
  user_id: string | null
  jenis: 'Masuk' | 'Keluar'
  jumlah: number
  nota: string | null
  pautan_resit: string | null
  created_at: string
  users?: User
}

export interface Gallery {
  id: string
  user_id: string | null
  keterangan: string | null
  tags: string | null
  pautan_gambar: string | null
  file_id: string | null
  created_at: string
  users?: User
}

export interface Config {
  key: string
  value: string
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript types for database models"
```

---

### Task 1.3: Create Utility Functions

**Files:**
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Create utils file**

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency: 'MYR',
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ms-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatTime(time: string | null): string {
  if (!time) return ''
  return time.substring(0, 5) // HH:MM
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/utils.ts
git commit -m "feat: add utility functions for formatting"
```

---

## Phase 2: Supabase Setup

### Task 2.1: Create Supabase Client

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`

- [ ] **Step 1: Create browser client**

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 2: Create server client**

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/
git commit -m "feat: add Supabase client configuration"
```

---

### Task 2.2: Create Database Queries

**Files:**
- Create: `src/lib/supabase/queries.ts`

- [ ] **Step 1: Create queries file**

```typescript
// src/lib/supabase/queries.ts
import { createClient } from './client'
import type { User, Diary, Expense, Gallery } from '@/types'

// ============ USERS ============
export async function getUsers(): Promise<User[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('status', 'Aktif')
    .order('nama')

  if (error) throw error
  return data
}

// ============ DIARY ============
export async function getDiaries(limit = 50): Promise<Diary[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('diary')
    .select('*, users(nama)')
    .order('tarikh', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function getDiaryById(id: string): Promise<Diary | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('diary')
    .select('*, users(nama)')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createDiary(entry: Omit<Diary, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('diary')
    .insert(entry)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateDiary(id: string, entry: Partial<Diary>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('diary')
    .update({ ...entry, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteDiary(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('diary').delete().eq('id', id)
  if (error) throw error
}

// ============ EXPENSES ============
export async function getExpenses(limit = 50): Promise<Expense[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('expenses')
    .select('*, users(nama)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function createExpense(entry: Omit<Expense, 'id' | 'created_at'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('expenses')
    .insert(entry)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteExpense(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('expenses').delete().eq('id', id)
  if (error) throw error
}

export async function getCurrentBalance(): Promise<number> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_current_balance')

  if (error) return 0
  return data || 0
}

// ============ GALLERY ============
export async function getGallery(limit = 50): Promise<Gallery[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('gallery')
    .select('*, users(nama)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function createGallery(entry: Omit<Gallery, 'id' | 'created_at'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('gallery')
    .insert(entry)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteGallery(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('gallery').delete().eq('id', id)
  if (error) throw error
}

// ============ CONFIG ============
export async function checkPasscode(passcode: string): Promise<boolean> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('check_passcode', {
    input_passcode: passcode,
  })

  if (error) return false
  return data
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/supabase/queries.ts
git commit -m "feat: add database query functions"
```

---

## Phase 3: Authentication

### Task 3.1: Create Auth Library

**Files:**
- Create: `src/lib/auth.ts`

- [ ] **Step 1: Create auth library**

```typescript
// src/lib/auth.ts
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET_KEY = process.env.AUTH_SECRET || 'diary-mama-secret-key'
const key = new TextEncoder().encode(SECRET_KEY)

export interface SessionData {
  isAuthenticated: boolean
  expiresAt: Date
}

export async function encrypt(payload: SessionData): Promise<string> {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

export async function decrypt(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    })
    return payload as SessionData
  } catch {
    return null
  }
}

export async function createSession(rememberMe = false) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session = await encrypt({ isAuthenticated: true, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: rememberMe ? expiresAt : undefined,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) return null
  return decrypt(token)
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session?.isAuthenticated === true
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/auth.ts
git commit -m "feat: add JWT session authentication"
```

---

### Task 3.2: Create Auth API Routes

**Files:**
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/logout/route.ts`

- [ ] **Step 1: Create login route**

```typescript
// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { checkPasscode } from '@/lib/supabase/queries'
import { createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { passcode, rememberMe } = await request.json()

    if (!passcode) {
      return NextResponse.json(
        { success: false, error: 'Passcode diperlukan' },
        { status: 400 }
      )
    }

    const isValid = await checkPasscode(passcode)

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Passcode salah' },
        { status: 401 }
      )
    }

    await createSession(rememberMe)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Ralat server' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 2: Create logout route**

```typescript
// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'
import { deleteSession } from '@/lib/auth'

export async function POST() {
  await deleteSession()
  return NextResponse.json({ success: true })
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/auth/
git commit -m "feat: add login and logout API routes"
```

---

## Phase 4: UI Components

### Task 4.1: Install shadcn/ui Components

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/label.tsx`
- Create: `src/components/ui/select.tsx`
- Create: `src/components/ui/textarea.tsx`
- Create: `src/components/ui/dialog.tsx`

- [ ] **Step 1: Create button component**

```typescript
// src/components/ui/button.tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50',
        ghost: 'hover:bg-gray-100',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

- [ ] **Step 2: Create input component**

```typescript
// src/components/ui/input.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
```

- [ ] **Step 3: Create card component**

```typescript
// src/components/ui/card.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-xl border bg-white shadow-sm', className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-semibold leading-none tracking-tight', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

export { Card, CardHeader, CardTitle, CardContent }
```

- [ ] **Step 4: Create label component**

```typescript
// src/components/ui/label.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('text-sm font-medium text-gray-700', className)}
        {...props}
      />
    )
  }
)
Label.displayName = 'Label'

export { Label }
```

- [ ] **Step 5: Create select component**

```typescript
// src/components/ui/select.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }
)
Select.displayName = 'Select'

export { Select }
```

- [ ] **Step 6: Create textarea component**

```typescript
// src/components/ui/textarea.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
```

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add UI components (button, input, card, select, textarea)"
```

---

### Task 4.2: Create Layout Components

**Files:**
- Create: `src/components/layout/navbar.tsx`
- Create: `src/components/layout/bottom-nav.tsx`

- [ ] **Step 1: Create navbar**

```typescript
// src/components/layout/navbar.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, Menu } from 'lucide-react'

interface NavbarProps {
  title?: string
}

export function Navbar({ title = 'Diari Mama' }: NavbarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="flex items-center justify-between h-14 px-4">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Create bottom navigation**

```typescript
// src/components/layout/bottom-nav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Wallet, Image } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Utama' },
  { href: '/diary', icon: BookOpen, label: 'Diari' },
  { href: '/expenses', icon: Wallet, label: 'Wang' },
  { href: '/gallery', icon: Image, label: 'Galeri' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full',
                isActive ? 'text-primary-600' : 'text-gray-500'
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add navbar and bottom navigation components"
```

---

## Phase 5: App Layout & Pages

### Task 5.1: Create Root Layout

**Files:**
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`

- [ ] **Step 1: Create global CSS**

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: system-ui, -apple-system, sans-serif;
  }

  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer utilities {
  .safe-area-pb {
    padding-bottom: env(safe-area-inset-bottom);
  }

  .pb-nav {
    padding-bottom: 4rem;
  }
}
```

- [ ] **Step 2: Create root layout**

```typescript
// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Diari Mama',
  description: 'Sistem Diari Rawatan & Perbelanjaan Mama',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: add root layout and global styles"
```

---

### Task 5.2: Create Login Page

**Files:**
- Create: `src/app/page.tsx`

- [ ] **Step 1: Create login page**

```typescript
// src/app/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [passcode, setPasscode] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode, rememberMe }),
      })

      const data = await res.json()

      if (data.success) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(data.error || 'Passcode salah')
      }
    } catch {
      setError('Ralat server. Sila cuba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-600 p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Diari Mama</h1>
            <p className="text-gray-500 mt-1">Masukkan passcode</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="passcode">Passcode</Label>
              <Input
                id="passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <Label htmlFor="rememberMe" className="font-normal">
                Ingat saya
              </Label>
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Memproses...' : 'Log Masuk'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add login page with passcode authentication"
```

---

### Task 5.3: Create Authenticated Layout

**Files:**
- Create: `src/app/(authenticated)/layout.tsx`

- [ ] **Step 1: Create authenticated layout with middleware check**

```typescript
// src/app/(authenticated)/layout.tsx
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { Navbar } from '@/components/layout/navbar'
import { BottomNav } from '@/components/layout/bottom-nav'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pb-nav">{children}</main>
      <BottomNav />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(authenticated\)/layout.tsx
git commit -m "feat: add authenticated layout with session check"
```

---

### Task 5.4: Create Dashboard Page

**Files:**
- Create: `src/app/(authenticated)/dashboard/page.tsx`
- Create: `src/components/expenses/balance-card.tsx`

- [ ] **Step 1: Create balance card component**

```typescript
// src/components/expenses/balance-card.tsx
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { Wallet } from 'lucide-react'

interface BalanceCardProps {
  balance: number
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const isPositive = balance >= 0

  return (
    <Card className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-full">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm opacity-80">Baki Semasa</p>
            <p className={`text-2xl font-bold ${isPositive ? '' : 'text-red-300'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Create dashboard page**

```typescript
// src/app/(authenticated)/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BalanceCard } from '@/components/expenses/balance-card'
import { getCurrentBalance, getDiaries, getGallery } from '@/lib/supabase/queries'
import { formatDate } from '@/lib/utils'
import { BookOpen, Image, PlusCircle } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const [balance, diaries, gallery] = await Promise.all([
    getCurrentBalance(),
    getDiaries(5),
    getGallery(6),
  ])

  return (
    <div className="p-4 space-y-6">
      {/* Balance */}
      <BalanceCard balance={balance} />

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Link
          href="/diary/new"
          className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm"
        >
          <BookOpen className="w-6 h-6 text-primary-600 mb-2" />
          <span className="text-xs text-gray-600">Diari Baru</span>
        </Link>
        <Link
          href="/expenses/new"
          className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm"
        >
          <PlusCircle className="w-6 h-6 text-green-600 mb-2" />
          <span className="text-xs text-gray-600">Perbelanjaan</span>
        </Link>
        <Link
          href="/gallery/new"
          className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm"
        >
          <Image className="w-6 h-6 text-purple-600 mb-2" />
          <span className="text-xs text-gray-600">Gambar Baru</span>
        </Link>
      </div>

      {/* Recent Diaries */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Diari Terkini</CardTitle>
        </CardHeader>
        <CardContent>
          {diaries.length === 0 ? (
            <p className="text-gray-500 text-sm">Tiada entri diari lagi.</p>
          ) : (
            <div className="space-y-3">
              {diaries.map((diary) => (
                <div key={diary.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {diary.users?.nama || 'Tidak diketahui'}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(diary.tarikh)}</p>
                    {diary.catatan && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {diary.catatan}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Gallery */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Gambar Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {gallery.length === 0 ? (
            <p className="text-gray-500 text-sm">Tiada gambar lagi.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                >
                  {item.pautan_gambar && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.pautan_gambar}
                      alt={item.keterangan || 'Gallery image'}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(authenticated\)/dashboard/ src/components/expenses/balance-card.tsx
git commit -m "feat: add dashboard page with balance, quick actions, and recent items"
```

---

## Phase 6: Diary Feature

### Task 6.1: Create Diary Components

**Files:**
- Create: `src/components/diary/diary-form.tsx`
- Create: `src/components/diary/diary-card.tsx`

- [ ] **Step 1: Create diary form**

```typescript
// src/components/diary/diary-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createDiary, updateDiary, getUsers } from '@/lib/supabase/queries'
import type { Diary, User } from '@/types'

interface DiaryFormProps {
  diary?: Diary | null
}

export function DiaryForm({ diary }: DiaryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState({
    user_id: diary?.user_id || '',
    tarikh: diary?.tarikh || new Date().toISOString().split('T')[0],
    masa: diary?.masa || '',
    lokasi: diary?.lokasi || '',
    status_kejadian: diary?.status_kejadian || '',
    catatan: diary?.catatan || '',
    pautan_dokumen: diary?.pautan_dokumen || '',
  })

  useState(() => {
    getUsers().then(setUsers)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (diary) {
        await updateDiary(diary.id, formData)
      } else {
        await createDiary(formData)
      }
      router.push('/diary')
      router.refresh()
    } catch (error) {
      console.error('Error saving diary:', error)
      alert('Ralat menyimpan diari')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <Label htmlFor="user_id">Nama</Label>
        <Select
          id="user_id"
          value={formData.user_id}
          onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
          options={[
            { value: '', label: 'Pilih nama...' },
            ...users.map((u) => ({ value: u.id, label: u.nama })),
          ]}
          className="mt-1"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tarikh">Tarikh</Label>
          <Input
            id="tarikh"
            type="date"
            value={formData.tarikh}
            onChange={(e) => setFormData({ ...formData, tarikh: e.target.value })}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="masa">Masa</Label>
          <Input
            id="masa"
            type="time"
            value={formData.masa}
            onChange={(e) => setFormData({ ...formData, masa: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="lokasi">Lokasi</Label>
        <Input
          id="lokasi"
          value={formData.lokasi}
          onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
          placeholder="Hospital, Klinik, Rumah..."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="status_kejadian">Status/Kejadian</Label>
        <Input
          id="status_kejadian"
          value={formData.status_kejadian}
          onChange={(e) => setFormData({ ...formData, status_kejadian: e.target.value })}
          placeholder="Check-up, Rawatan, Kejadian..."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="catatan">Catatan</Label>
        <Textarea
          id="catatan"
          value={formData.catatan}
          onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
          placeholder="Catatan rawatan..."
          className="mt-1"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="pautan_dokumen">Pautan Dokumen (URL)</Label>
        <Input
          id="pautan_dokumen"
          type="url"
          value={formData.pautan_dokumen}
          onChange={(e) => setFormData({ ...formData, pautan_dokumen: e.target.value })}
          placeholder="https://..."
          className="mt-1"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          Batal
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  )
}
```

- [ ] **Step 2: Create diary card**

```typescript
// src/components/diary/diary-card.tsx
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, formatTime } from '@/lib/utils'
import type { Diary } from '@/types'
import { Calendar, MapPin, Clock } from 'lucide-react'

interface DiaryCardProps {
  diary: Diary
}

export function DiaryCard({ diary }: DiaryCardProps) {
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold">{diary.users?.nama || 'Tidak diketahui'}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(diary.tarikh)}
              </span>
              {diary.masa && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTime(diary.masa)}
                </span>
              )}
            </div>
          </div>
          {diary.status_kejadian && (
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
              {diary.status_kejadian}
            </span>
          )}
        </div>

        {diary.lokasi && (
          <p className="flex items-center gap-1 text-sm text-gray-500 mt-2">
            <MapPin className="w-4 h-4" />
            {diary.lokasi}
          </p>
        )}

        {diary.catatan && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{diary.catatan}</p>
        )}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/diary/
git commit -m "feat: add diary form and card components"
```

---

### Task 6.2: Create Diary Pages

**Files:**
- Create: `src/app/(authenticated)/diary/page.tsx`
- Create: `src/app/(authenticated)/diary/new/page.tsx`

- [ ] **Step 1: Create diary list page**

```typescript
// src/app/(authenticated)/diary/page.tsx
import { getDiaries } from '@/lib/supabase/queries'
import { DiaryCard } from '@/components/diary/diary-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function DiaryPage() {
  const diaries = await getDiaries()

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Diari Rawatan</h2>
        <Link href="/diary/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Baru
          </Button>
        </Link>
      </div>

      {diaries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Tiada entri diari lagi.</p>
          <Link href="/diary/new">
            <Button className="mt-4">Tambah Diari</Button>
          </Link>
        </div>
      ) : (
        <div>
          {diaries.map((diary) => (
            <DiaryCard key={diary.id} diary={diary} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create new diary page**

```typescript
// src/app/(authenticated)/diary/new/page.tsx
import { DiaryForm } from '@/components/diary/diary-form'

export default function NewDiaryPage() {
  return (
    <div>
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-semibold">Diari Baru</h2>
      </div>
      <DiaryForm />
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(authenticated\)/diary/
git commit -m "feat: add diary list and new diary pages"
```

---

## Phase 7: Expenses Feature

### Task 7.1: Create Expenses Components

**Files:**
- Create: `src/components/expenses/expense-form.tsx`
- Create: `src/components/expenses/expense-list.tsx`

- [ ] **Step 1: Create expense form**

```typescript
// src/components/expenses/expense-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createExpense, getUsers } from '@/lib/supabase/queries'
import type { User } from '@/types'

export function ExpenseForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState({
    user_id: '',
    jenis: 'Keluar' as 'Masuk' | 'Keluar',
    jumlah: '',
    nota: '',
    pautan_resit: '',
  })

  useState(() => {
    getUsers().then(setUsers)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createExpense({
        user_id: formData.user_id || null,
        jenis: formData.jenis,
        jumlah: parseFloat(formData.jumlah),
        nota: formData.nota || null,
        pautan_resit: formData.pautan_resit || null,
      })
      router.push('/expenses')
      router.refresh()
    } catch (error) {
      console.error('Error saving expense:', error)
      alert('Ralat menyimpan perbelanjaan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <Label htmlFor="jenis">Jenis</Label>
        <Select
          id="jenis"
          value={formData.jenis}
          onChange={(e) => setFormData({ ...formData, jenis: e.target.value as 'Masuk' | 'Keluar' })}
          options={[
            { value: 'Keluar', label: 'Keluar (Perbelanjaan)' },
            { value: 'Masuk', label: 'Masuk (Pendapatan)' },
          ]}
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="user_id">Nama (Pilihan)</Label>
        <Select
          id="user_id"
          value={formData.user_id}
          onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
          options={[
            { value: '', label: 'Pilih nama...' },
            ...users.map((u) => ({ value: u.id, label: u.nama })),
          ]}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="jumlah">Jumlah (RM)</Label>
        <Input
          id="jumlah"
          type="number"
          step="0.01"
          min="0"
          value={formData.jumlah}
          onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
          placeholder="0.00"
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="nota">Nota/Tujuan</Label>
        <Textarea
          id="nota"
          value={formData.nota}
          onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
          placeholder="Keterangan perbelanjaan..."
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="pautan_resit">Pautan Resit (URL)</Label>
        <Input
          id="pautan_resit"
          type="url"
          value={formData.pautan_resit}
          onChange={(e) => setFormData({ ...formData, pautan_resit: e.target.value })}
          placeholder="https://..."
          className="mt-1"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          Batal
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  )
}
```

- [ ] **Step 2: Create expense list**

```typescript
// src/components/expenses/expense-list.tsx
'use client'

import { formatCurrency, formatDate } from '@/lib/utils'
import { deleteExpense } from '@/lib/supabase/queries'
import { Button } from '@/components/ui/button'
import type { Expense } from '@/types'
import { Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ExpenseListProps {
  expenses: Expense[]
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Padam entri ini?')) return

    try {
      await deleteExpense(id)
      router.refresh()
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('Ralat memadam entri')
    }
  }

  if (expenses.length === 0) {
    return <p className="text-gray-500 text-center py-8">Tiada rekod perbelanjaan.</p>
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between p-3 bg-white rounded-lg border"
        >
          <div className="flex items-center gap-3">
            {expense.jenis === 'Masuk' ? (
              <ArrowDownCircle className="w-8 h-8 text-green-600" />
            ) : (
              <ArrowUpCircle className="w-8 h-8 text-red-600" />
            )}
            <div>
              <p className="font-medium">
                {expense.jenis === 'Masuk' ? '+' : '-'}{formatCurrency(expense.jumlah)}
              </p>
              <p className="text-xs text-gray-500">
                {expense.users?.nama || 'Tidak diketahui'} • {formatDate(expense.created_at)}
              </p>
              {expense.nota && (
                <p className="text-sm text-gray-600">{expense.nota}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(expense.id)}
          >
            <Trash2 className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/expenses/
git commit -m "feat: add expense form and list components"
```

---

### Task 7.2: Create Expenses Pages

**Files:**
- Create: `src/app/(authenticated)/expenses/page.tsx`
- Create: `src/app/(authenticated)/expenses/new/page.tsx`

- [ ] **Step 1: Create expenses list page**

```typescript
// src/app/(authenticated)/expenses/page.tsx
import { getExpenses, getCurrentBalance } from '@/lib/supabase/queries'
import { BalanceCard } from '@/components/expenses/balance-card'
import { ExpenseList } from '@/components/expenses/expense-list'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function ExpensesPage() {
  const [expenses, balance] = await Promise.all([
    getExpenses(),
    getCurrentBalance(),
  ])

  return (
    <div className="p-4 space-y-4">
      <BalanceCard balance={balance} />

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Rekod Perbelanjaan</h2>
        <Link href="/expenses/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Baru
          </Button>
        </Link>
      </div>

      <ExpenseList expenses={expenses} />
    </div>
  )
}
```

- [ ] **Step 2: Create new expense page**

```typescript
// src/app/(authenticated)/expenses/new/page.tsx
import { ExpenseForm } from '@/components/expenses/expense-form'

export default function NewExpensePage() {
  return (
    <div>
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-semibold">Perbelanjaan Baru</h2>
      </div>
      <ExpenseForm />
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(authenticated\)/expenses/
git commit -m "feat: add expenses list and new expense pages"
```

---

## Phase 8: Gallery Feature

### Task 8.1: Create Gallery Components

**Files:**
- Create: `src/components/gallery/image-grid.tsx`
- Create: `src/components/gallery/image-upload.tsx`

- [ ] **Step 1: Create image grid**

```typescript
// src/components/gallery/image-grid.tsx
'use client'

import { useState } from 'react'
import { formatDate } from '@/lib/utils'
import { deleteGallery } from '@/lib/supabase/queries'
import { Button } from '@/components/ui/button'
import type { Gallery } from '@/types'
import { Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ImageGridProps {
  images: Gallery[]
}

export function ImageGrid({ images }: ImageGridProps) {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<Gallery | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Padam gambar ini?')) return

    try {
      await deleteGallery(id)
      router.refresh()
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Ralat memadam gambar')
    }
  }

  if (images.length === 0) {
    return <p className="text-gray-500 text-center py-8">Tiada gambar lagi.</p>
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group"
          >
            {image.pautan_gambar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.pautan_gambar}
                alt={image.keterangan || 'Gallery image'}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setSelectedImage(image)}
              />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
              <div className="text-white text-xs">
                <p>{image.users?.nama}</p>
                <p>{formatDate(image.created_at)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-red-400"
                onClick={() => handleDelete(image.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          {selectedImage.pautan_gambar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedImage.pautan_gambar}
              alt={selectedImage.keterangan || 'Gallery image'}
              className="max-w-full max-h-full object-contain"
            />
          )}
          {selectedImage.keterangan && (
            <p className="absolute bottom-8 text-white text-center max-w-md">
              {selectedImage.keterangan}
            </p>
          )}
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Create image upload component (placeholder for now)**

```typescript
// src/components/gallery/image-upload.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { createGallery, getUsers } from '@/lib/supabase/queries'
import type { User } from '@/types'
import { Upload } from 'lucide-react'

export function ImageUpload() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [imageUrl, setImageUrl] = useState('')
  const [formData, setFormData] = useState({
    user_id: '',
    keterangan: '',
    tags: '',
  })

  useState(() => {
    getUsers().then(setUsers)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageUrl) {
      alert('Sila masukkan URL gambar')
      return
    }

    setLoading(true)

    try {
      await createGallery({
        user_id: formData.user_id || null,
        keterangan: formData.keterangan || null,
        tags: formData.tags || null,
        pautan_gambar: imageUrl,
        file_id: null,
      })
      router.push('/gallery')
      router.refresh()
    } catch (error) {
      console.error('Error saving image:', error)
      alert('Ralat menyimpan gambar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <Label htmlFor="imageUrl">URL Gambar</Label>
        <Input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://drive.google.com/..."
          className="mt-1"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Masukkan URL gambar dari Google Drive atau sumber lain
        </p>
      </div>

      {imageUrl && (
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <div>
        <Label htmlFor="user_id">Nama (Pilihan)</Label>
        <Select
          id="user_id"
          value={formData.user_id}
          onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
          options={[
            { value: '', label: 'Pilih nama...' },
            ...users.map((u) => ({ value: u.id, label: u.nama })),
          ]}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="keterangan">Keterangan</Label>
        <Textarea
          id="keterangan"
          value={formData.keterangan}
          onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
          placeholder="Keterangan gambar..."
          className="mt-1"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="rawatan, hospital, family"
          className="mt-1"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          Batal
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/gallery/
git commit -m "feat: add gallery image grid and upload components"
```

---

### Task 8.2: Create Gallery Pages

**Files:**
- Create: `src/app/(authenticated)/gallery/page.tsx`
- Create: `src/app/(authenticated)/gallery/new/page.tsx`

- [ ] **Step 1: Create gallery list page**

```typescript
// src/app/(authenticated)/gallery/page.tsx
import { getGallery } from '@/lib/supabase/queries'
import { ImageGrid } from '@/components/gallery/image-grid'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function GalleryPage() {
  const images = await getGallery(100)

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Galeri</h2>
        <Link href="/gallery/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Baru
          </Button>
        </Link>
      </div>

      <ImageGrid images={images} />
    </div>
  )
}
```

- [ ] **Step 2: Create new gallery page**

```typescript
// src/app/(authenticated)/gallery/new/page.tsx
import { ImageUpload } from '@/components/gallery/image-upload'

export default function NewGalleryPage() {
  return (
    <div>
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-semibold">Gambar Baru</h2>
      </div>
      <ImageUpload />
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(authenticated\)/gallery/
git commit -m "feat: add gallery list and new gallery pages"
```

---

## Phase 9: PWA Setup

### Task 9.1: Create PWA Manifest and Icons

**Files:**
- Create: `public/manifest.json`
- Create: `public/icon-192.png` (placeholder)
- Create: `public/icon-512.png` (placeholder)

- [ ] **Step 1: Create manifest.json**

```json
{
  "name": "Diari Mama",
  "short_name": "Diari Mama",
  "description": "Sistem Diari Rawatan & Perbelanjaan Mama",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

- [ ] **Step 2: Create placeholder icons (run this command to create simple colored squares)**

```bash
# Create simple placeholder icons (you can replace these with proper icons later)
# For now, we'll skip this step and note it as a TODO
echo "TODO: Add proper PWA icons (icon-192.png, icon-512.png)"
```

- [ ] **Step 3: Commit**

```bash
git add public/manifest.json
git commit -m "feat: add PWA manifest"
```

---

## Phase 10: Testing & Deployment

### Task 10.1: Test the Application

- [ ] **Step 1: Run development server**

```bash
npm run dev
```

- [ ] **Step 2: Test login functionality**
- Navigate to `http://localhost:3000`
- Enter passcode: `mama1234`
- Should redirect to dashboard

- [ ] **Step 3: Test diary feature**
- Add a new diary entry
- View in list
- Verify data in Supabase

- [ ] **Step 4: Test expenses feature**
- Add income and expense entries
- Verify balance calculation
- Test delete functionality

- [ ] **Step 5: Test gallery feature**
- Add image with URL
- View in grid
- Test lightbox

---

### Task 10.2: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**

```bash
git add .
git commit -m "feat: complete Diary Mama application"
git branch -M main
git remote add origin https://github.com/kamkikorich/DiaryMama.git
git push -u origin main
```

- [ ] **Step 2: Deploy to Vercel**
1. Go to vercel.com
2. Import project from GitHub
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `AUTH_SECRET`
   - `GOOGLE_DRIVE_FOLDER_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
4. Deploy

---

## Summary

| Phase | Tasks | Files Created |
|-------|-------|---------------|
| 1. Project Setup | 3 | 10 |
| 2. Supabase | 2 | 3 |
| 3. Authentication | 2 | 3 |
| 4. UI Components | 2 | 9 |
| 5. Layout & Pages | 4 | 5 |
| 6. Diary | 2 | 4 |
| 7. Expenses | 2 | 4 |
| 8. Gallery | 2 | 4 |
| 9. PWA | 1 | 1 |
| 10. Deployment | 2 | 0 |

**Total: 22 Tasks**