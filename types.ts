export interface Position {
  x: number;
  y: number;
}

export interface Obstacle {
  id: string;
  x: number;
  gapY: number;
  passed: boolean;
}

export interface GameState {
  score: number;
  isGameOver: boolean;
  isPlaying: boolean;
}

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
}
