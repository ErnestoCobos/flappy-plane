# flappy-plane
A Flappy Bird-style mobile game built with Expo where you pilot a plane through towers. Features global leaderboards powered by Supabase.

## Features

- 🎮 Classic Flappy Bird gameplay with tap-to-fly controls
- ✈️ Smooth animations using React Native Animated API
- 🏆 Global leaderboard with top 100 players
- 👤 Anonymous authentication via Supabase
- 💥 Explosion animations on collision
- 📊 Distance-based scoring system
- 🎵 Sound effects (expo-av ready)
- 📱 Responsive design for iOS and Android
- ⚡ Gravity-based physics engine

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ErnestoCobos/flappy-plane.git
cd flappy-plane
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase (Optional - for leaderboard functionality):
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL Editor
   - Create a `.env` file in the root directory with your Supabase credentials:
     ```
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Start the development server:
```bash
npm start
```

5. Run on your device:
   - Install the [Expo Go](https://expo.dev/client) app on your iOS or Android device
   - Scan the QR code from the terminal

## How to Play

1. **Tap anywhere** on the screen to make the plane fly upward
2. **Avoid the towers/buildings** - navigate through the gaps
3. Each successfully passed tower increases your score by 1
4. The game ends if you hit a tower or the ground
5. Submit your score to the global leaderboard!

## Project Structure

```
flappy-plane/
├── App.tsx              # Main game component
├── constants.ts         # Game configuration constants
├── types.ts            # TypeScript type definitions
├── supabaseClient.ts   # Supabase client configuration
├── supabase-schema.sql # Database schema for leaderboard
├── package.json        # Dependencies
└── assets/            # Game assets (icons, images)
```

## Technologies Used

- **Expo** - React Native framework
- **TypeScript** - Type-safe development
- **React Native Animated API** - Smooth animations
- **expo-av** - Audio/video library for sound effects
- **expo-linear-gradient** - Gradient backgrounds
- **Supabase** - Backend for leaderboard and authentication
- **@supabase/supabase-js** - Supabase JavaScript client

## Game Configuration

You can customize the game physics and appearance by editing `constants.ts`:

- `GRAVITY` - How fast the plane falls
- `JUMP_VELOCITY` - How high the plane jumps on tap
- `OBSTACLE_SPEED` - How fast obstacles move
- `GAP_SIZE` - Size of the gap between obstacles
- `OBSTACLE_SPACING` - Distance between obstacles

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

MIT License - feel free to use this project for learning or building your own game!

## Credits

Created as a demonstration of React Native game development with Expo and Supabase integration.
