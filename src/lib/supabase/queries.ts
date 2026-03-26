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