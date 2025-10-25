-- Supabase SQL Schema for Flappy Plane Leaderboard
-- Run this SQL in your Supabase SQL Editor to set up the leaderboard table

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON leaderboard(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to read leaderboard
CREATE POLICY "Allow public read access"
ON leaderboard FOR SELECT
USING (true);

-- Allow authenticated users to insert their scores
CREATE POLICY "Allow authenticated insert"
ON leaderboard FOR INSERT
WITH CHECK (true);

-- Optional: Create a view for top 100 players
CREATE OR REPLACE VIEW top_100_leaderboard AS
SELECT id, player_name, score, created_at
FROM leaderboard
ORDER BY score DESC
LIMIT 100;
