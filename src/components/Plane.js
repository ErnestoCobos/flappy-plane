import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const Plane = ({ x, y, rotation, isExploding }) => {
  return (
    <Animated.View
      style={[
        styles.plane,
        {
          left: x,
          top: y,
          transform: [{ rotate: rotation }],
        },
      ]}
    >
      {isExploding ? (
        <View style={styles.explosion}>
          <View style={[styles.particle, styles.particle1]} />
          <View style={[styles.particle, styles.particle2]} />
          <View style={[styles.particle, styles.particle3]} />
          <View style={[styles.particle, styles.particle4]} />
        </View>
      ) : (
        <View style={styles.planeBody}>
          <View style={styles.wing} />
          <View style={styles.tail} />
          <View style={styles.cockpit} />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  plane: {
    position: 'absolute',
    width: 60,
    height: 40,
    zIndex: 10,
  },
  planeBody: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2E5C8A',
  },
  wing: {
    position: 'absolute',
    width: 40,
    height: 10,
    backgroundColor: '#E85D75',
    top: 15,
    left: 10,
    borderRadius: 5,
  },
  tail: {
    position: 'absolute',
    width: 15,
    height: 20,
    backgroundColor: '#E85D75',
    right: 5,
    top: 5,
    borderTopRightRadius: 10,
  },
  cockpit: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#FFF',
    borderRadius: 6,
    left: 8,
    top: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  explosion: {
    width: 60,
    height: 60,
    position: 'relative',
  },
  particle: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#FF6B35',
  },
  particle1: {
    top: 0,
    left: 0,
    backgroundColor: '#FF6B35',
  },
  particle2: {
    top: 0,
    right: 0,
    backgroundColor: '#F7931E',
  },
  particle3: {
    bottom: 0,
    left: 0,
    backgroundColor: '#FDC830',
  },
  particle4: {
    bottom: 0,
    right: 0,
    backgroundColor: '#E85D75',
  },
});

export default Plane;
