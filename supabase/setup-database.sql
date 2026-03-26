-- =====================================================
-- DIARY MAMA - SUPABASE DATABASE SETUP
-- Run this in Supabase SQL Editor
-- =====================================================

-- ==================== DROP EXISTING TABLES ====================
-- Uncomment if you want to reset everything
-- DROP TABLE IF EXISTS gallery CASCADE;
-- DROP TABLE IF EXISTS expenses CASCADE;
-- DROP TABLE IF EXISTS diary CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS config CASCADE;

-- ==================== CREATE TABLES ====================

-- Users (Ahli keluarga)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(50) NOT NULL UNIQUE,
  role VARCHAR(20) DEFAULT 'adik-beradik',
  status VARCHAR(20) DEFAULT 'Aktif',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Diari Rawatan
CREATE TABLE IF NOT EXISTS diary (
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
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  jenis VARCHAR(20) NOT NULL CHECK (jenis IN ('Masuk', 'Keluar')),
  jumlah DECIMAL(12,2) NOT NULL,
  nota TEXT,
  pautan_resit VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Galeri
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  keterangan TEXT,
  tags VARCHAR(200),
  pautan_gambar VARCHAR(500),
  file_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Config (Passcode & settings)
CREATE TABLE IF NOT EXISTS config (
  key VARCHAR(50) PRIMARY KEY,
  value TEXT NOT NULL
);

-- ==================== CREATE INDEXES ====================

CREATE INDEX IF NOT EXISTS idx_diary_user ON diary(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_tarikh ON diary(tarikh DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_user ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_created ON expenses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_created ON gallery(created_at DESC);

-- ==================== INSERT DEFAULT DATA ====================

-- Insert default users (ahli keluarga)
INSERT INTO users (nama, role) VALUES
  ('Walter', 'adik-beradik'),
  ('Marius', 'adik-beradik'),
  ('Adrian', 'adik-beradik'),
  ('Oswald', 'adik-beradik'),
  ('Brenda', 'adik-beradik'),
  ('Justinah', 'pengurus')
ON CONFLICT (nama) DO NOTHING;

-- Insert default passcode
INSERT INTO config (key, value) VALUES
  ('passcode', 'mama1234')
ON CONFLICT (key) DO NOTHING;

-- ==================== ENABLE ROW LEVEL SECURITY ====================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- ==================== RLS POLICIES ====================
-- Allow all operations for now (public access dengan passcode)
-- You can make this more restrictive later

CREATE POLICY "Allow all on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all on diary" ON diary FOR ALL USING (true);
CREATE POLICY "Allow all on expenses" ON expenses FOR ALL USING (true);
CREATE POLICY "Allow all on gallery" ON gallery FOR ALL USING (true);
CREATE POLICY "Allow all on config" ON config FOR ALL USING (true);

-- ==================== UPDATED_AT TRIGGER ====================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_diary_updated_at
    BEFORE UPDATE ON diary
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==================== HELPER FUNCTIONS ====================

-- Function to get current balance
CREATE OR REPLACE FUNCTION get_current_balance()
RETURNS DECIMAL(12,2) AS $$
DECLARE
    total_balance DECIMAL(12,2);
BEGIN
    SELECT COALESCE(
        SUM(CASE WHEN jenis = 'Masuk' THEN jumlah ELSE -jumlah END),
        0
    ) INTO total_balance
    FROM expenses;

    RETURN total_balance;
END;
$$ LANGUAGE plpgsql;

-- Function to check passcode
CREATE OR REPLACE FUNCTION check_passcode(input_passcode TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    stored_passcode TEXT;
BEGIN
    SELECT value INTO stored_passcode FROM config WHERE key = 'passcode';
    RETURN input_passcode = stored_passcode;
END;
$$ LANGUAGE plpgsql;

-- ==================== GRANT PERMISSIONS ====================

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ==================== DONE ====================

-- Verify setup
SELECT 'Users: ' || COUNT(*)::TEXT as table_status FROM users
UNION ALL
SELECT 'Config: ' || COUNT(*)::TEXT FROM config;

-- =====================================================
-- SETUP COMPLETE!
-- Next: Get your Supabase URL and anon key from:
-- Settings > API > Project URL / anon public key
-- =====================================================