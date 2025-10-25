import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Text,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from './supabaseClient';
import { Obstacle, LeaderboardEntry } from './types';
import { GAME_CONFIG } from './constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function App() {
  // Game state
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  
  // Animation values
  const planeY = useRef(new Animated.Value(GAME_CONFIG.PLANE_START_Y)).current;
  const planeRotation = useRef(new Animated.Value(0)).current;
  const explosionScale = useRef(new Animated.Value(0)).current;
  
  // Game loop ref
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const velocityRef = useRef(0);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const planeYRef = useRef(GAME_CONFIG.PLANE_START_Y);
  
  // Sound effects
  const flapSound = useRef<Audio.Sound | null>(null);
  const collisionSound = useRef<Audio.Sound | null>(null);
  const scoreSound = useRef<Audio.Sound | null>(null);
  
  // Load sounds
  useEffect(() => {
    loadSounds();
    setupAnonymousAuth();
    
    return () => {
      // Cleanup sounds
      flapSound.current?.unloadAsync();
      collisionSound.current?.unloadAsync();
      scoreSound.current?.unloadAsync();
    };
  }, []);
  
  const loadSounds = async () => {
    try {
      // Create simple beep sounds programmatically
      // In a real app, you would load actual sound files
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.log('Error loading sounds:', error);
    }
  };
  
  const setupAnonymousAuth = async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      if (data.user) {
        setUserId(data.user.id);
      }
    } catch (error) {
      console.log('Auth error:', error);
      // Use a fallback ID if auth fails
      setUserId('anonymous-' + Math.random().toString(36).substr(2, 9));
    }
  };
  
  const playSound = async (soundRef: React.MutableRefObject<Audio.Sound | null>) => {
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };
  
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    velocityRef.current = 0;
    planeYRef.current = GAME_CONFIG.PLANE_START_Y;
    planeY.setValue(GAME_CONFIG.PLANE_START_Y);
    explosionScale.setValue(0);
    
    // Initialize obstacles
    const initialObstacles: Obstacle[] = [];
    for (let i = 0; i < 3; i++) {
      initialObstacles.push({
        id: `obstacle-${i}`,
        x: SCREEN_WIDTH + i * GAME_CONFIG.OBSTACLE_SPACING,
        gapY: Math.random() * (SCREEN_HEIGHT - GAME_CONFIG.GAP_SIZE - 200) + 100,
        passed: false,
      });
    }
    setObstacles(initialObstacles);
    obstaclesRef.current = initialObstacles;
    
    // Start game loop
    startGameLoop();
  };
  
  const startGameLoop = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    
    gameLoopRef.current = setInterval(() => {
      updateGame();
    }, GAME_CONFIG.GAME_LOOP_INTERVAL);
  };
  
  const updateGame = () => {
    // Update velocity and position
    velocityRef.current += GAME_CONFIG.GRAVITY;
    const currentY = planeYRef.current;
    const newY = currentY + velocityRef.current;
    
    // Check ground collision
    if (newY > SCREEN_HEIGHT - GAME_CONFIG.PLANE_SIZE - 50 || newY < 0) {
      endGame();
      return;
    }
    
    planeYRef.current = newY;
    planeY.setValue(newY);
    
    // Update plane rotation based on velocity
    const rotation = Math.max(-30, Math.min(30, velocityRef.current * 3));
    planeRotation.setValue(rotation);
    
    // Update obstacles
    const updatedObstacles = obstaclesRef.current.map((obstacle) => {
      const newX = obstacle.x - GAME_CONFIG.OBSTACLE_SPEED;
      
      // Check if obstacle is passed
      if (!obstacle.passed && newX + GAME_CONFIG.OBSTACLE_WIDTH < GAME_CONFIG.PLANE_START_X) {
        setScore((prev) => {
          const newScore = prev + 1;
          playSound(scoreSound);
          return newScore;
        });
        return { ...obstacle, x: newX, passed: true };
      }
      
      return { ...obstacle, x: newX };
    });
    
    // Remove off-screen obstacles and add new ones
    const filteredObstacles = updatedObstacles.filter(
      (obstacle) => obstacle.x > -GAME_CONFIG.OBSTACLE_WIDTH
    );
    
    // Add new obstacle if needed
    if (filteredObstacles.length < 3) {
      const lastObstacle = filteredObstacles[filteredObstacles.length - 1];
      filteredObstacles.push({
        id: `obstacle-${Date.now()}`,
        x: lastObstacle.x + GAME_CONFIG.OBSTACLE_SPACING,
        gapY: Math.random() * (SCREEN_HEIGHT - GAME_CONFIG.GAP_SIZE - 200) + 100,
        passed: false,
      });
    }
    
    obstaclesRef.current = filteredObstacles;
    setObstacles(filteredObstacles);
    
    // Check collisions
    checkCollisions(filteredObstacles);
  };
  
  const checkCollisions = (currentObstacles: Obstacle[]) => {
    const planeYValue = planeYRef.current;
    const planeLeft = GAME_CONFIG.PLANE_START_X;
    const planeRight = planeLeft + GAME_CONFIG.PLANE_SIZE;
    const planeTop = planeYValue;
    const planeBottom = planeTop + GAME_CONFIG.PLANE_SIZE;
    
    for (const obstacle of currentObstacles) {
      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + GAME_CONFIG.OBSTACLE_WIDTH;
      
      // Check if plane overlaps with obstacle horizontally
      if (planeRight > obstacleLeft && planeLeft < obstacleRight) {
        // Check if plane hits top or bottom obstacle
        if (planeTop < obstacle.gapY || planeBottom > obstacle.gapY + GAME_CONFIG.GAP_SIZE) {
          endGame();
          return;
        }
      }
    }
  };
  
  const endGame = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    setGameState('gameOver');
    playSound(collisionSound);
    
    // Trigger explosion animation
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
  };
  
  const handleTap = () => {
    if (gameState === 'playing') {
      velocityRef.current = GAME_CONFIG.JUMP_VELOCITY;
      playSound(flapSound);
      
      // Animate plane rotation
      Animated.sequence([
        Animated.timing(planeRotation, {
          toValue: -30,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };
  
  const saveScore = async () => {
    if (!playerName.trim() || !userId) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('leaderboard')
        .insert([
          {
            user_id: userId,
            player_name: playerName.trim(),
            score: score,
          },
        ]);
      
      if (error) throw error;
      
      Alert.alert('Success', 'Score saved to leaderboard!');
      fetchLeaderboard();
    } catch (error) {
      console.log('Error saving score:', error);
      Alert.alert('Info', 'Leaderboard feature requires Supabase setup. Score: ' + score);
    }
  };
  
  const fetchLeaderboard = async () => {
    try {
      // Fetch top 100 scores
      const { data: topScores, error: topError } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(100);
      
      if (topError) throw topError;
      
      setLeaderboard(topScores || []);
      
      // Find user's rank if they have a score
      if (userId) {
        const { data: userScores, error: userError } = await supabase
          .from('leaderboard')
          .select('score')
          .eq('user_id', userId)
          .order('score', { ascending: false })
          .limit(1);
        
        if (!userError && userScores && userScores.length > 0) {
          const userBestScore = userScores[0].score;
          const { count } = await supabase
            .from('leaderboard')
            .select('*', { count: 'exact', head: true })
            .gt('score', userBestScore);
          
          setUserRank((count || 0) + 1);
        }
      }
      
      setShowLeaderboard(true);
    } catch (error) {
      console.log('Error fetching leaderboard:', error);
      Alert.alert('Info', 'Leaderboard feature requires Supabase setup');
    }
  };
  
  const renderMenu = () => (
    <LinearGradient colors={['#87CEEB', '#E0F6FF']} style={styles.container}>
      <View style={styles.menuContainer}>
        <Text style={styles.title}>✈️ Flappy Plane ✈️</Text>
        <Text style={styles.subtitle}>Tap to fly, avoid the towers!</Text>
        
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={fetchLeaderboard}>
          <Text style={styles.buttonText}>Leaderboard</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
  
  const renderGame = () => (
    <TouchableOpacity
      style={styles.gameContainer}
      activeOpacity={1}
      onPress={handleTap}
    >
      <LinearGradient colors={['#87CEEB', '#E0F6FF']} style={styles.container}>
        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score}</Text>
        </View>
        
        {/* Obstacles */}
        {obstacles.map((obstacle) => (
          <View key={obstacle.id}>
            {/* Top obstacle */}
            <View
              style={[
                styles.obstacle,
                {
                  left: obstacle.x,
                  top: 0,
                  height: obstacle.gapY,
                },
              ]}
            />
            {/* Bottom obstacle */}
            <View
              style={[
                styles.obstacle,
                {
                  left: obstacle.x,
                  top: obstacle.gapY + GAME_CONFIG.GAP_SIZE,
                  height: SCREEN_HEIGHT - obstacle.gapY - GAME_CONFIG.GAP_SIZE,
                },
              ]}
            />
          </View>
        ))}
        
        {/* Plane */}
        <Animated.View
          style={[
            styles.plane,
            {
              left: GAME_CONFIG.PLANE_START_X,
              top: planeY,
              transform: [
                {
                  rotate: planeRotation.interpolate({
                    inputRange: [-30, 30],
                    outputRange: ['-30deg', '30deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.planeEmoji}>✈️</Text>
        </Animated.View>
        
        {/* Explosion */}
        <Animated.View
          style={[
            styles.explosion,
            {
              left: GAME_CONFIG.PLANE_START_X - 25,
              top: planeY,
              transform: [{ scale: explosionScale }],
            },
          ]}
        >
          <Text style={styles.explosionEmoji}>💥</Text>
        </Animated.View>
        
        {/* Ground */}
        <View style={styles.ground} />
      </LinearGradient>
    </TouchableOpacity>
  );
  
  const renderGameOver = () => (
    <LinearGradient colors={['#87CEEB', '#E0F6FF']} style={styles.container}>
      <View style={styles.gameOverContainer}>
        <Text style={styles.gameOverTitle}>Game Over!</Text>
        <Text style={styles.gameOverScore}>Score: {score}</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={playerName}
          onChangeText={setPlayerName}
          maxLength={20}
        />
        
        <TouchableOpacity style={styles.button} onPress={saveScore}>
          <Text style={styles.buttonText}>Save Score</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={startGame}
        >
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => {
            setGameState('menu');
            setObstacles([]);
          }}
        >
          <Text style={styles.buttonText}>Main Menu</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
  
  const renderLeaderboard = () => (
    <LinearGradient colors={['#87CEEB', '#E0F6FF']} style={styles.container}>
      <View style={styles.leaderboardContainer}>
        <Text style={styles.title}>🏆 Leaderboard 🏆</Text>
        
        {userRank && (
          <Text style={styles.rankText}>Your Rank: #{userRank}</Text>
        )}
        
        <View style={styles.leaderboardList}>
          {leaderboard.length === 0 ? (
            <Text style={styles.noScoresText}>
              No scores yet. Be the first!
            </Text>
          ) : (
            leaderboard.map((entry, index) => (
              <View key={entry.id} style={styles.leaderboardEntry}>
                <Text style={styles.leaderboardRank}>#{index + 1}</Text>
                <Text style={styles.leaderboardName}>{entry.player_name}</Text>
                <Text style={styles.leaderboardScore}>{entry.score}</Text>
              </View>
            ))
          )}
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setShowLeaderboard(false);
            setGameState('menu');
          }}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
  
  return (
    <>
      <StatusBar style="dark" />
      {showLeaderboard
        ? renderLeaderboard()
        : gameState === 'menu'
        ? renderMenu()
        : gameState === 'playing'
        ? renderGame()
        : renderGameOver()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#34495E',
    marginBottom: 50,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    minWidth: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  secondaryButton: {
    backgroundColor: '#95A5A6',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gameContainer: {
    flex: 1,
  },
  scoreContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    zIndex: 100,
  },
  scoreText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  plane: {
    position: 'absolute',
    width: GAME_CONFIG.PLANE_SIZE,
    height: GAME_CONFIG.PLANE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planeEmoji: {
    fontSize: 40,
  },
  explosion: {
    position: 'absolute',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  explosionEmoji: {
    fontSize: 80,
  },
  obstacle: {
    position: 'absolute',
    width: GAME_CONFIG.OBSTACLE_WIDTH,
    backgroundColor: '#8B4513',
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#654321',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    width: SCREEN_WIDTH,
    height: 50,
    backgroundColor: '#90EE90',
    borderTopWidth: 3,
    borderTopColor: '#228B22',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameOverTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#E74C3C',
    marginBottom: 20,
  },
  gameOverScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    minWidth: 250,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#BDC3C7',
  },
  leaderboardContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  rankText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27AE60',
    textAlign: 'center',
    marginBottom: 20,
  },
  leaderboardList: {
    flex: 1,
    marginVertical: 20,
  },
  leaderboardEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  leaderboardRank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    width: 50,
  },
  leaderboardName: {
    fontSize: 16,
    color: '#34495E',
    flex: 1,
  },
  leaderboardScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498DB',
  },
  noScoresText: {
    fontSize: 18,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 50,
  },
});
