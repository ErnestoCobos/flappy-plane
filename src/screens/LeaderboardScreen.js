import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { gameService } from '../services/gameService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LeaderboardScreen = ({ onBack, currentUsername }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [playerRank, setPlayerRank] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const topScores = await gameService.getTopScores(100);
      setScores(topScores);

      if (currentUsername) {
        const rank = await gameService.getPlayerRank(currentUsername);
        setPlayerRank(rank);
      }
    } catch (error) {
      console.error('Error al cargar leaderboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLeaderboard();
  };

  const getMedalEmoji = (position) => {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${position}`;
    }
  };

  const renderItem = ({ item, index }) => {
    const isCurrentUser = currentUsername && item.username === currentUsername;
    const position = index + 1;

    return (
      <View
        style={[
          styles.scoreItem,
          isCurrentUser && styles.currentUserItem,
          position <= 3 && styles.topThreeItem,
        ]}
      >
        <View style={styles.rankContainer}>
          <Text style={[styles.rank, position <= 3 && styles.topThreeRank]}>
            {getMedalEmoji(position)}
          </Text>
        </View>

        <View style={styles.playerInfo}>
          <Text
            style={[styles.username, isCurrentUser && styles.currentUsername]}
            numberOfLines={1}
          >
            {item.username}
            {isCurrentUser && ' (Tú)'}
          </Text>
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={[styles.score, isCurrentUser && styles.currentUserScore]}>
            {Math.floor(item.score)}
          </Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>🏆 Clasificación Mundial</Text>
      <Text style={styles.subtitle}>Top 100 Jugadores</Text>

      {playerRank && (
        <View style={styles.playerRankCard}>
          <Text style={styles.playerRankTitle}>Tu Posición</Text>
          <View style={styles.playerRankInfo}>
            <Text style={styles.playerRankPosition}>
              #{playerRank.rank}
            </Text>
            <Text style={styles.playerRankScore}>
              Mejor: {Math.floor(playerRank.score)}
            </Text>
          </View>
          <Text style={styles.playerRankTotal}>
            de {playerRank.total} jugadores
          </Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Cargando clasificación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={scores}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay puntuaciones aún.{'\n'}¡Sé el primero!
            </Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  listContent: {
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 20,
  },
  playerRankCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    width: SCREEN_WIDTH - 40,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  playerRankTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  playerRankInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  playerRankPosition: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  playerRankScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  playerRankTotal: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  topThreeItem: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  currentUserItem: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  topThreeRank: {
    fontSize: 24,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  currentUsername: {
    color: '#4A90E2',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  scoreContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  currentUserScore: {
    fontSize: 20,
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default LeaderboardScreen;
