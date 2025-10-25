import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const Obstacle = ({ x, topHeight, gap, width = 60 }) => {
  const bottomHeight = SCREEN_HEIGHT - topHeight - gap - 100; // 100 es el margen del suelo

  return (
    <>
      {/* Torre superior */}
      <View
        style={[
          styles.obstacle,
          styles.topObstacle,
          {
            left: x,
            height: topHeight,
            width: width,
          },
        ]}
      >
        <View style={[styles.building, { height: topHeight - 20 }]}>
          {[...Array(Math.floor(topHeight / 30))].map((_, i) => (
            <View key={i} style={styles.window} />
          ))}
        </View>
        <View style={[styles.buildingTop, { width: width + 10 }]} />
      </View>

      {/* Torre inferior */}
      <View
        style={[
          styles.obstacle,
          styles.bottomObstacle,
          {
            left: x,
            height: bottomHeight,
            width: width,
            bottom: 0,
          },
        ]}
      >
        <View style={[styles.buildingBottom, { width: width + 10 }]} />
        <View style={[styles.building, { height: bottomHeight - 20 }]}>
          {[...Array(Math.floor(bottomHeight / 30))].map((_, i) => (
            <View key={i} style={styles.window} />
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  obstacle: {
    position: 'absolute',
    backgroundColor: '#5A5A5A',
    zIndex: 5,
  },
  topObstacle: {
    top: 0,
  },
  bottomObstacle: {
    bottom: 0,
  },
  building: {
    flex: 1,
    backgroundColor: '#3A3A3A',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
    alignContent: 'flex-start',
  },
  buildingTop: {
    height: 20,
    backgroundColor: '#5A5A5A',
    position: 'absolute',
    bottom: 0,
    left: -5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  buildingBottom: {
    height: 20,
    backgroundColor: '#5A5A5A',
    position: 'absolute',
    top: 0,
    left: -5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  window: {
    width: 8,
    height: 8,
    backgroundColor: '#FFD700',
    margin: 2,
    borderRadius: 1,
  },
});

export default Obstacle;
