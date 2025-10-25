import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { gameService } from '../services/gameService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen = ({ onStartGame, onViewLeaderboard }) => {
  const [username, setUsername] = useState('');
  const [savedUsername, setSavedUsername] = useState(null);
  const [loading, setLoading] = useState(false);

  const titleScale = new Animated.Value(0);
  const buttonScale = new Animated.Value(0);

  useEffect(() => {
    loadSavedPlayer();

    // Animación de entrada
    Animated.sequence([
      Animated.spring(titleScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadSavedPlayer = async () => {
    const player = await gameService.getLocalPlayer();
    if (player) {
      setSavedUsername(player.username);
      setUsername(player.username);
    }
  };

  const handleStartGame = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre de usuario');
      return;
    }

    setLoading(true);
    try {
      await gameService.getOrCreatePlayer(username.trim());
      onStartGame(username.trim());
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar el juego. Verifica tu conexión.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Fondo animado */}
      <View style={styles.background}>
        <View style={[styles.cloud, { top: 100, left: 50 }]} />
        <View style={[styles.cloud, { top: 200, left: 250 }]} />
        <View style={[styles.cloud, { top: 400, left: 100 }]} />
      </View>

      <Animated.View style={[styles.content, { transform: [{ scale: titleScale }] }]}>
        <Text style={styles.title}>✈️ Flappy Plane</Text>
        <Text style={styles.subtitle}>¡Esquiva las torres y alcanza el cielo!</Text>
      </Animated.View>

      <Animated.View style={[styles.inputContainer, { transform: [{ scale: buttonScale }] }]}>
        {savedUsername && (
          <Text style={styles.welcomeBack}>¡Bienvenido de nuevo, {savedUsername}!</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          maxLength={20}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, styles.playButton]}
          onPress={handleStartGame}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Cargando...' : '🎮 Jugar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.leaderboardButton]}
          onPress={onViewLeaderboard}
        >
          <Text style={styles.buttonText}>🏆 Clasificación Mundial</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Toca la pantalla para volar</Text>
        <Text style={styles.footerText}>¡Evita las torres!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cloud: {
    position: 'absolute',
    width: 100,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25,
  },
  content: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 10,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: SCREEN_WIDTH - 40,
    alignItems: 'center',
  },
  welcomeBack: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 15,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  button: {
    width: '100%',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  leaderboardButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#FFF',
    fontSize: 14,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginTop: 5,
  },
});

export default HomeScreen;
