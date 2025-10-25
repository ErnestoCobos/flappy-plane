# Flappy Plane - Implementation Documentation

## Project Overview
This is a complete Flappy Bird-style game built with Expo/React Native. The game features a plane that players control to navigate through towers/buildings.

## Key Features Implemented

### 1. Core Gameplay
- **Gravity Physics**: Continuous downward acceleration (0.6 units/frame)
- **Tap-to-Fly Controls**: Players tap to apply upward velocity (-12 units)
- **Collision Detection**: Accurate bounding box collision between plane and obstacles
- **Distance-Based Scoring**: Score increments when plane passes each obstacle

### 2. Visual Effects
- **Smooth Animations**: Using React Native Animated API
  - Plane rotation based on velocity
  - Explosion animation on collision (scale animation)
  - Smooth position updates at ~60 FPS
- **Responsive UI**: Adapts to different screen sizes using Dimensions API
- **Gradient Backgrounds**: Sky-blue gradient using expo-linear-gradient

### 3. Game States
- **Menu**: Start game and view leaderboard
- **Playing**: Active gameplay with real-time physics
- **Game Over**: Score submission and replay options

### 4. Leaderboard System
- **Supabase Integration**: Backend for storing and retrieving scores
- **Anonymous Authentication**: Users automatically authenticated
- **Top 100 Display**: Shows the best 100 scores globally
- **User Ranking**: Displays individual player's rank

### 5. Sound Effects Infrastructure
- **expo-av Integration**: Audio system ready for sound effects
- **Three Sound Types**: Flap, collision, and score sounds (hooks in place)

## Technical Architecture

### File Structure
```
App.tsx              - Main game component with all game logic
constants.ts         - Game configuration (physics, dimensions, colors)
types.ts            - TypeScript interfaces for game objects
supabaseClient.ts   - Supabase client configuration
supabase-schema.sql - Database schema for leaderboard table
```

### Game Loop
- Runs at 16ms intervals (~60 FPS)
- Updates:
  1. Velocity (gravity applied each frame)
  2. Plane position
  3. Plane rotation
  4. Obstacle positions
  5. Collision detection
  6. Score tracking

### Physics Engine
- **Gravity**: 0.6 units per frame
- **Jump Velocity**: -12 units (upward)
- **Obstacle Speed**: 3 pixels per frame
- **Gap Size**: 200 pixels between top and bottom obstacles

### Collision Detection
Uses bounding box algorithm:
- Checks horizontal overlap with obstacles
- Checks if plane is outside the gap vertically
- Checks ground and ceiling collisions

## Configuration

### Game Constants (configurable in constants.ts)
- `GRAVITY`: How fast the plane falls
- `JUMP_VELOCITY`: How high the plane jumps
- `OBSTACLE_SPEED`: Horizontal speed of obstacles
- `GAP_SIZE`: Vertical space between obstacles
- `OBSTACLE_SPACING`: Horizontal distance between obstacle pairs

### Colors
- Sky: #87CEEB (light blue)
- Obstacles: #8B4513 (brown - representing buildings)
- Ground: #90EE90 (light green)

## Supabase Setup

### Required Environment Variables
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Database Schema
The `leaderboard` table includes:
- `id` (UUID, primary key)
- `user_id` (TEXT, anonymous user identifier)
- `player_name` (TEXT, player's chosen name)
- `score` (INTEGER, distance traveled)
- `created_at` (TIMESTAMP, when score was recorded)

### Row Level Security
- Public read access for all scores
- Authenticated users can insert scores
- Prevents unauthorized modifications

## Platform Support
- **iOS**: Full support
- **Android**: Full support
- **Web**: Possible with additional dependencies (react-dom, react-native-web)

## Performance Optimizations
- Uses `useRef` for values that update frequently (velocity, position)
- Obstacles stored in refs to avoid unnecessary re-renders
- Animated.Value for smooth 60 FPS animations
- Efficient collision detection algorithm

## Future Enhancements (Not Yet Implemented)
- Actual sound files (currently infrastructure only)
- Power-ups and special abilities
- Different plane skins
- Multiple difficulty levels
- Daily challenges
- Social sharing features

## Testing the Game
1. Install Expo Go on your mobile device
2. Run `npm start` in the project directory
3. Scan the QR code with your device
4. Test all game features:
   - Tap to fly
   - Score increases when passing obstacles
   - Collision detection works
   - Game over screen appears
   - Leaderboard displays (if Supabase configured)

## Known Limitations
- Supabase integration requires manual setup (URL and keys)
- Sound effects infrastructure in place but no actual sound files
- Web platform requires additional dependencies