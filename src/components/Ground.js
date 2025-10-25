import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Ground = () => {
  return (
    <View style={styles.ground}>
      <View style={styles.grass} />
      <View style={styles.dirt} />
    </View>
  );
};

const styles = StyleSheet.create({
  ground: {
    position: 'absolute',
    bottom: 0,
    width: SCREEN_WIDTH,
    height: 100,
    backgroundColor: '#8B4513',
  },
  grass: {
    width: '100%',
    height: 20,
    backgroundColor: '#228B22',
    borderBottomWidth: 2,
    borderBottomColor: '#1a6b1a',
  },
  dirt: {
    flex: 1,
    backgroundColor: '#8B4513',
  },
});

export default Ground;
