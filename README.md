# ✈️ Flappy Plane

Un juego estilo Flappy Bird construido con Expo (React Native) donde controlas un avión que debe esquivar torres y edificios. Incluye física de gravedad realista, sistema de puntuación global con Supabase, y efectos de sonido.

![Flappy Plane](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue)
![React Native](https://img.shields.io/badge/React%20Native-Expo-green)
![Supabase](https://img.shields.io/badge/Backend-Supabase-orange)

## 🎮 Características

- **Física Realista**: El avión responde a la gravedad y sube al tocar la pantalla
- **Obstáculos Dinámicos**: Torres y edificios con alturas y espacios aleatorios
- **Detección de Colisiones**: Sistema preciso de colisión con animación de explosión
- **Sistema de Puntuación**: Puntuación automática según la distancia recorrida
- **Efectos de Sonido**: Audio para tap, colisión y puntuación (usando expo-av)
- **Leaderboard Global**: Clasificación mundial con top 100 jugadores
- **Ranking Personal**: Muestra tu posición en el ranking global
- **Autenticación**: Sistema de usuario con nombre personalizado
- **Persistencia**: Guarda tu usuario localmente para sesiones futuras
- **UI Moderna**: Diseño responsive que funciona en iOS y Android
- **Animaciones Fluidas**: Usando Animated API de React Native
- **Optimizado**: Rendimiento optimizado para dispositivos móviles (60 FPS)

## 📱 Capturas de Pantalla

El juego incluye:
- **Pantalla de Inicio**: Ingresa tu nombre de usuario y accede al juego o leaderboard
- **Pantalla de Juego**: Toca para volar, esquiva las torres
- **Pantalla de Game Over**: Muestra tu puntuación y récords personales
- **Pantalla de Clasificación**: Top 100 mundial con tu posición destacada

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn
- Expo CLI
- Cuenta de Supabase (gratuita)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/flappy-plane.git
cd flappy-plane
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

#### a) Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a **Settings > API** y copia:
   - Project URL
   - Anon/Public Key

#### b) Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env` y agrega tus credenciales de Supabase:

```
EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon
```

#### c) Crear las tablas en Supabase

Ve al **SQL Editor** en Supabase y ejecuta el siguiente script:

```sql
-- Crear tabla de jugadores
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de puntuaciones
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_scores_score ON scores(score DESC);
CREATE INDEX idx_scores_created_at ON scores(created_at DESC);

-- Habilitar Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir lectura pública
CREATE POLICY "Allow public read access on players"
  ON players FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on scores"
  ON scores FOR SELECT
  USING (true);

-- Políticas para permitir inserción
CREATE POLICY "Allow insert for authenticated users on players"
  ON players FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow insert for authenticated users on scores"
  ON scores FOR INSERT
  WITH CHECK (true);
```

> **Nota**: Para más detalles sobre la configuración de Supabase, consulta el archivo [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 4. Ejecutar la aplicación

```bash
# Iniciar el servidor de desarrollo
npm start

# O ejecutar en plataforma específica
npm run android  # Para Android
npm run ios      # Para iOS (solo en macOS)
npm run web      # Para web
```

## 🎯 Cómo Jugar

1. **Inicio**: Ingresa tu nombre de usuario
2. **Volar**: Toca la pantalla para hacer que el avión suba
3. **Objetivo**: Esquiva las torres/edificios
4. **Puntuación**: Se incrementa automáticamente según la distancia
5. **Game Over**: Ocurre al chocar con una torre o el suelo
6. **Récord**: Intenta superar tu mejor puntuación y escalar en el ranking mundial

## 🏗️ Estructura del Proyecto

```
flappy-plane/
├── src/
│   ├── components/
│   │   ├── Plane.js          # Componente del avión
│   │   ├── Obstacle.js       # Torres/edificios
│   │   └── Ground.js         # Suelo del juego
│   ├── screens/
│   │   ├── HomeScreen.js     # Pantalla de inicio
│   │   ├── GameScreen.js     # Pantalla principal del juego
│   │   ├── GameOverScreen.js # Pantalla de fin del juego
│   │   └── LeaderboardScreen.js # Clasificación mundial
│   ├── services/
│   │   ├── gameService.js    # Lógica de Supabase
│   │   └── audioService.js   # Sistema de audio
│   └── config/
│       └── supabase.js       # Configuración de Supabase
├── assets/                   # Imágenes y sonidos
├── App.js                    # Componente principal
├── app.json                  # Configuración de Expo
└── package.json              # Dependencias
```

## 🛠️ Tecnologías Utilizadas

- **React Native**: Framework para desarrollo móvil
- **Expo**: Plataforma de desarrollo y despliegue
- **Supabase**: Backend as a Service (base de datos PostgreSQL)
- **expo-av**: Biblioteca de audio
- **@react-native-async-storage/async-storage**: Almacenamiento local
- **Animated API**: Animaciones nativas de React Native

## 🎨 Características Técnicas

### Física del Juego
- Gravedad constante de 0.6
- Velocidad de salto de -12
- Game loop a 60 FPS
- Detección de colisiones por bounding box

### Optimización
- Renderizado condicional de componentes
- Limpieza de obstáculos fuera de pantalla
- Uso de `useNativeDriver` para animaciones
- Memoización de componentes cuando es necesario

### Persistencia de Datos
- Almacenamiento local del usuario con AsyncStorage
- Sincronización con Supabase para puntuaciones
- Caché de mejor puntuación personal

## 📝 Tareas Futuras / Mejoras Posibles

- [ ] Añadir archivos de audio reales (actualmente usa placeholders)
- [ ] Implementar power-ups y bonificaciones
- [ ] Agregar diferentes niveles de dificultad
- [ ] Incluir logros y medallas
- [ ] Modo multijugador en tiempo real
- [ ] Personalización del avión (skins)
- [ ] Efectos de partículas más elaborados
- [ ] Modo nocturno/diurno
- [ ] Vibración en colisiones (Haptic Feedback)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Creado con ❤️ usando Claude Code

## 🐛 Reporte de Bugs

Si encuentras algún bug, por favor abre un issue en GitHub con:
- Descripción del problema
- Pasos para reproducirlo
- Comportamiento esperado vs comportamiento actual
- Screenshots si es posible

## 💡 Soporte

Para preguntas o soporte:
- Abre un issue en GitHub
- Consulta la documentación de [Expo](https://docs.expo.dev/)
- Revisa la documentación de [Supabase](https://supabase.com/docs)

---

**¡Disfruta el juego y compite por el primer lugar en el leaderboard mundial!** 🏆✈️
