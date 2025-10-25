# Configuración de Supabase

## Pasos para configurar Supabase:

1. Crear una cuenta en [Supabase](https://supabase.com)
2. Crear un nuevo proyecto
3. Ir a Settings > API para obtener:
   - Project URL
   - Anon/Public key

4. Crear un archivo `.env` en la raíz del proyecto con:
```
EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon
```

## Crear las tablas necesarias:

Ve a SQL Editor en Supabase y ejecuta:

```sql
-- Crear tabla de jugadores
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de puntuaciones
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para mejorar el rendimiento de las consultas
CREATE INDEX idx_scores_score ON scores(score DESC);
CREATE INDEX idx_scores_created_at ON scores(created_at DESC);

-- Habilitar Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir lectura pública
CREATE POLICY "Allow public read access on players"
  ON players FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on scores"
  ON scores FOR SELECT
  USING (true);

-- Políticas para permitir inserción
CREATE POLICY "Allow insert for authenticated users on players"
  ON players FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow insert for authenticated users on scores"
  ON scores FOR INSERT
  WITH CHECK (true);
```

## Habilitar autenticación anónima:

1. Ve a Authentication > Settings
2. Desactiva "Enable email confirmations" si quieres registro simple
3. O habilita "Anonymous sign-ins" para autenticación anónima
