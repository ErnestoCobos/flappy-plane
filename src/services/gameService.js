import { supabase } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAYER_KEY = '@flappy_plane_player';

export const gameService = {
  // Obtener o crear jugador
  async getOrCreatePlayer(username) {
    try {
      // Buscar si el jugador ya existe
      const { data: existingPlayer } = await supabase
        .from('players')
        .select('*')
        .eq('username', username)
        .single();

      if (existingPlayer) {
        await AsyncStorage.setItem(PLAYER_KEY, JSON.stringify(existingPlayer));
        return existingPlayer;
      }

      // Crear nuevo jugador
      const { data: newPlayer, error } = await supabase
        .from('players')
        .insert([{ username }])
        .select()
        .single();

      if (error) throw error;

      await AsyncStorage.setItem(PLAYER_KEY, JSON.stringify(newPlayer));
      return newPlayer;
    } catch (error) {
      console.error('Error al obtener/crear jugador:', error);
      throw error;
    }
  },

  // Obtener jugador guardado localmente
  async getLocalPlayer() {
    try {
      const playerData = await AsyncStorage.getItem(PLAYER_KEY);
      return playerData ? JSON.parse(playerData) : null;
    } catch (error) {
      console.error('Error al obtener jugador local:', error);
      return null;
    }
  },

  // Guardar puntuación
  async saveScore(username, score) {
    try {
      const { data, error } = await supabase
        .from('scores')
        .insert([
          {
            username,
            score,
          },
        ])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al guardar puntuación:', error);
      throw error;
    }
  },

  // Obtener top 100 puntuaciones
  async getTopScores(limit = 100) {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener puntuaciones:', error);
      return [];
    }
  },

  // Obtener posición del jugador en el ranking
  async getPlayerRank(username) {
    try {
      // Obtener todas las puntuaciones ordenadas
      const { data: allScores, error } = await supabase
        .from('scores')
        .select('username, score')
        .order('score', { ascending: false });

      if (error) throw error;

      // Encontrar la mejor puntuación del jugador y su posición
      const playerScores = allScores.filter((s) => s.username === username);
      if (playerScores.length === 0) return null;

      const bestScore = Math.max(...playerScores.map((s) => s.score));
      const rank = allScores.findIndex((s) => s.score === bestScore && s.username === username) + 1;

      return {
        rank,
        score: bestScore,
        total: allScores.length,
      };
    } catch (error) {
      console.error('Error al obtener ranking del jugador:', error);
      return null;
    }
  },

  // Obtener mejor puntuación del jugador
  async getPlayerBestScore(username) {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('score')
        .eq('username', username)
        .order('score', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.score || 0;
    } catch (error) {
      console.error('Error al obtener mejor puntuación:', error);
      return 0;
    }
  },
};
