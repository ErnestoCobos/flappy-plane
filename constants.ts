import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const GAME_CONFIG = {
  // Screen dimensions
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  
  // Physics
  GRAVITY: 0.6,
  JUMP_VELOCITY: -12,
  
  // Plane
  PLANE_SIZE: 50,
  PLANE_START_X: SCREEN_WIDTH * 0.25,
  PLANE_START_Y: SCREEN_HEIGHT * 0.5,
  
  // Obstacles
  OBSTACLE_WIDTH: 60,
  GAP_SIZE: 200,
  OBSTACLE_SPEED: 3,
  OBSTACLE_SPACING: SCREEN_WIDTH * 0.6,
  
  // Animation
  GAME_LOOP_INTERVAL: 16, // ~60 FPS
  
  // Colors
  SKY_COLOR: '#87CEEB',
  OBSTACLE_COLOR: '#8B4513',
  GROUND_COLOR: '#90EE90',
};
