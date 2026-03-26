// User - Ahli keluarga
export interface User {
  id: string
  nama: string
  role: string
  status: string
  created_at: string
}

// Diary - Diari rawatan
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

// Expense - Perbelanjaan
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

// Gallery - Galeri gambar
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

// Config - Konfigurasi sistem
export interface Config {
  key: string
  value: string
}