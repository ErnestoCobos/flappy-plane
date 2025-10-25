import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { gameService } from '../services/gameService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GameOverScreen = ({ score, username, onPlayAgain, onBackToHome, onViewLeaderboard }) => {
  const [saving, setSaving] = useState(true);
  const [bestScore, setBestScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    saveScore();

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const saveScore = async () => {
    try {
      // Obtener mejor puntuación anterior
      const previousBest = await gameService.getPlayerBestScore(username);
      setBestScore(previousBest);

      // Verificar si es nuevo récord
      if (score > previousBest) {
        setIsNewRecord(true);
      }

      // Guardar nueva puntuación
      await gameService.saveScore(username, score);
    } catch (error) {
      console.error('Error al guardar puntuación:', error);
      Alert.alert(
        'Error',
        'No se pudo guardar tu puntuación. Verifica tu conexión a internet.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.gameOverText}>Game Over!</Text>

        {isNewRecord && (
          <View style={styles.recordBadge}>
            <Text style={styles.recordText}>🎉 ¡NUEVO RÉCORD! 🎉</Text>
          </View>
        )}

        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Puntuación</Text>
          <Text style={styles.scoreValue}>{Math.floor(score)}</Text>

          {bestScore > 0 && !isNewRecord && (
            <View style={styles.bestScoreContainer}>
              <Text style={styles.bestScoreLabel}>Tu mejor:</Text>
              <Text style={styles.bestScoreValue}>{Math.floor(bestScore)}</Text>
            </View>
          )}
        </View>

        {saving ? (
          <View style={styles.savingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.savingText}>Guardando puntuación...</Text>
          </View>
        ) : (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.playAgainButton]}
              onPress={onPlayAgain}
            >
              <Text style={styles.buttonText}>🔄 Jugar de Nuevo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.leaderboardButton]}
              onPress={onViewLeaderboard}
            >
              <Text style={styles.buttonText}>🏆 Ver Clasificación</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.homeButton]}
              onPress={onBackToHome}
            >
              <Text style={styles.buttonText}>🏠 Menú Principal</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: SCREEN_WIDTH - 40,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  gameOverText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 20,
  },
  recordBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 20,
  },
  recordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  scoreCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#4A90E2',
  },
  scoreLabel: {
    fontSize: 20,
    color: '#666',
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  bestScoreContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestScoreLabel: {
    fontSize: 16,
    color: '#999',
    marginRight: 10,
  },
  bestScoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  savingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  savingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  playAgainButton: {
    backgroundColor: '#4CAF50',
  },
  leaderboardButton: {
    backgroundColor: '#FF9800',
  },
  homeButton: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameOverScreen;
