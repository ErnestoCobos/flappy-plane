import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Animated,
  Alert,
} from 'react-native';
import Plane from '../components/Plane';
import Obstacle from '../components/Obstacle';
import Ground from '../components/Ground';
import { audioService } from '../services/audioService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GRAVITY = 0.6;
const JUMP_VELOCITY = -12;
const PLANE_WIDTH = 60;
const PLANE_HEIGHT = 40;
const OBSTACLE_WIDTH = 60;
const GROUND_HEIGHT = 100;
const GAP_SIZE = 200;

const GameScreen = ({ username, onGameOver, onBack }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [planeY, setPlaneY] = useState(SCREEN_HEIGHT / 2 - 100);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [isExploding, setIsExploding] = useState(false);

  const planeRotation = useRef(new Animated.Value(0)).current;
  const explosionScale = useRef(new Animated.Value(0)).current;
  const gameLoopRef = useRef(null);
  const obstacleTimerRef = useRef(null);
  const scoreTimerRef = useRef(null);

  // Inicializar audio
  useEffect(() => {
    audioService.initialize();
    return () => {
      audioService.unloadAll();
    };
  }, []);

  // Generar obstáculos
  const generateObstacle = () => {
    const minHeight = 100;
    const maxHeight = SCREEN_HEIGHT - GROUND_HEIGHT - GAP_SIZE - 100;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);

    return {
      id: Date.now(),
      x: SCREEN_WIDTH,
      topHeight,
      gap: GAP_SIZE,
      passed: false,
    };
  };

  // Iniciar juego
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setPlaneY(SCREEN_HEIGHT / 2 - 100);
    setVelocity(0);
    setObstacles([]);
    setIsExploding(false);

    // Generar primer obstáculo
    setTimeout(() => {
      setObstacles([generateObstacle()]);
    }, 1000);

    // Timer para generar obstáculos
    obstacleTimerRef.current = setInterval(() => {
      setObstacles((prev) => [...prev, generateObstacle()]);
    }, 2500);

    // Timer para incrementar puntuación
    scoreTimerRef.current = setInterval(() => {
      setScore((prev) => prev + 1);
    }, 100);
  };

  // Saltar
  const jump = () => {
    if (!gameStarted) {
      startGame();
      return;
    }

    if (gameOver) return;

    setVelocity(JUMP_VELOCITY);
    audioService.generateBeep(800, 50);

    // Animación de rotación
    Animated.sequence([
      Animated.timing(planeRotation, {
        toValue: -30,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(planeRotation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Detección de colisiones
  const checkCollision = (y, obs) => {
    const planeLeft = 50;
    const planeRight = planeLeft + PLANE_WIDTH;
    const planeTop = y;
    const planeBottom = y + PLANE_HEIGHT;

    for (let obstacle of obs) {
      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + OBSTACLE_WIDTH;

      // Verificar si el avión está en el rango horizontal del obstáculo
      if (planeRight > obstacleLeft && planeLeft < obstacleRight) {
        // Verificar colisión con obstáculo superior
        if (planeTop < obstacle.topHeight) {
          return true;
        }

        // Verificar colisión con obstáculo inferior
        const bottomObstacleTop = obstacle.topHeight + obstacle.gap;
        if (planeBottom > bottomObstacleTop) {
          return true;
        }
      }
    }

    // Verificar colisión con el suelo
    if (planeBottom > SCREEN_HEIGHT - GROUND_HEIGHT) {
      return true;
    }

    // Verificar colisión con el techo
    if (planeTop < 0) {
      return true;
    }

    return false;
  };

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    gameLoopRef.current = setInterval(() => {
      setVelocity((v) => v + GRAVITY);
      setPlaneY((y) => {
        const newY = y + velocity;
        return newY;
      });

      setObstacles((prevObstacles) => {
        const newObstacles = prevObstacles
          .map((obstacle) => ({
            ...obstacle,
            x: obstacle.x - 5,
          }))
          .filter((obstacle) => obstacle.x > -OBSTACLE_WIDTH);

        // Verificar colisión
        if (checkCollision(planeY, newObstacles)) {
          handleGameOver();
        }

        return newObstacles;
      });
    }, 1000 / 60); // 60 FPS

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, velocity, planeY]);

  // Manejar fin del juego
  const handleGameOver = () => {
    setGameOver(true);
    setIsExploding(true);

    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (obstacleTimerRef.current) clearInterval(obstacleTimerRef.current);
    if (scoreTimerRef.current) clearInterval(scoreTimerRef.current);

    audioService.generateBeep(200, 300);

    // Animación de explosión
    Animated.sequence([
      Animated.timing(explosionScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(explosionScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      onGameOver(score);
    }, 1000);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={jump}
    >
      {/* Fondo */}
      <View style={styles.sky} />

      {/* Obstáculos */}
      {obstacles.map((obstacle) => (
        <Obstacle
          key={obstacle.id}
          x={obstacle.x}
          topHeight={obstacle.topHeight}
          gap={obstacle.gap}
          width={OBSTACLE_WIDTH}
        />
      ))}

      {/* Avión */}
      <Plane
        x={50}
        y={planeY}
        rotation={planeRotation.interpolate({
          inputRange: [-30, 0],
          outputRange: ['-30deg', '0deg'],
        })}
        isExploding={isExploding}
      />

      {/* Suelo */}
      <Ground />

      {/* HUD */}
      <View style={styles.hud}>
        <Text style={styles.score}>{Math.floor(score)}</Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Instrucciones iniciales */}
      {!gameStarted && (
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Flappy Plane</Text>
          <Text style={styles.instructionsText}>Toca la pantalla para volar</Text>
          <Text style={styles.instructionsSubtext}>Evita las torres</Text>
        </View>
      )}

      {/* Mensaje de Game Over */}
      {gameOver && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>¡Game Over!</Text>
          <Text style={styles.finalScore}>Puntuación: {Math.floor(score)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: GROUND_HEIGHT,
    backgroundColor: '#87CEEB',
  },
  hud: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 15,
  },
  instructionsTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 10,
    marginBottom: 20,
  },
  instructionsText: {
    fontSize: 24,
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 10,
  },
  instructionsSubtext: {
    fontSize: 18,
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  gameOverContainer: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 15,
  },
  gameOverText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 10,
    marginBottom: 20,
  },
  finalScore: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});

export default GameScreen;
