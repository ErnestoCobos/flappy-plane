import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import GameOverScreen from './src/screens/GameOverScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [username, setUsername] = useState('');
  const [finalScore, setFinalScore] = useState(0);

  const handleStartGame = (playerUsername) => {
    setUsername(playerUsername);
    setCurrentScreen('game');
  };

  const handleGameOver = (score) => {
    setFinalScore(score);
    setCurrentScreen('gameOver');
  };

  const handlePlayAgain = () => {
    setCurrentScreen('game');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleViewLeaderboard = () => {
    setCurrentScreen('leaderboard');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onStartGame={handleStartGame}
            onViewLeaderboard={handleViewLeaderboard}
          />
        );

      case 'game':
        return (
          <GameScreen
            username={username}
            onGameOver={handleGameOver}
            onBack={handleBackToHome}
          />
        );

      case 'gameOver':
        return (
          <GameOverScreen
            score={finalScore}
            username={username}
            onPlayAgain={handlePlayAgain}
            onBackToHome={handleBackToHome}
            onViewLeaderboard={handleViewLeaderboard}
          />
        );

      case 'leaderboard':
        return (
          <LeaderboardScreen
            onBack={handleBackToHome}
            currentUsername={username}
          />
        );

      default:
        return <HomeScreen onStartGame={handleStartGame} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
