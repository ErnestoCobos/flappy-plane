# 🚀 Inicio Rápido - Flappy Plane

## Pasos para ejecutar el juego:

### 1. Instalar dependencias (si aún no lo hiciste)
```bash
npm install
```

### 2. Configurar Supabase

#### Opción A: Usar Supabase (Recomendado para producción)

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia tu Project URL y Anon Key desde Settings > API
4. Crea un archivo `.env`:
   ```bash
   cp .env.example .env
   ```
5. Edita `.env` y agrega tus credenciales:
   ```
   EXPO_PUBLIC_SUPABASE_URL=tu_url_aqui
   EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_aqui
   ```
6. Ejecuta el SQL del archivo `SUPABASE_SETUP.md` en el SQL Editor de Supabase

#### Opción B: Modo de prueba (sin Supabase)

Si quieres probar el juego sin configurar Supabase:
- El juego funcionará pero no guardará puntuaciones
- El leaderboard estará vacío
- Puedes jugar normalmente

### 3. Ejecutar la aplicación

```bash
# Iniciar en modo desarrollo
npm start
```

Esto abrirá Expo Dev Tools. Desde ahí puedes:
- Escanear el QR con la app Expo Go (iOS/Android)
- Presionar `a` para abrir en emulador Android
- Presionar `i` para abrir en simulador iOS (solo macOS)
- Presionar `w` para abrir en navegador web

### 4. Jugar

1. Ingresa tu nombre de usuario
2. Presiona "Jugar"
3. Toca la pantalla para volar
4. ¡Evita las torres y consigue la mejor puntuación!

## Solución de problemas comunes

### Error de conexión a Supabase
- Verifica que tu archivo `.env` tenga las credenciales correctas
- Asegúrate de haber ejecutado el SQL para crear las tablas
- Verifica que las políticas de RLS estén configuradas

### El juego va lento
- Cierra otras aplicaciones
- Intenta reiniciar Expo con `npm start -- --clear`
- En dispositivo físico funciona mejor que en emulador

### No se escucha el audio
- Los efectos de audio usan placeholders programáticos
- Para audio real, agrega archivos .mp3 en `/assets/sounds/`

## Comandos útiles

```bash
# Limpiar caché de Expo
npm start -- --clear

# Instalar en Android
npm run android

# Instalar en iOS (solo macOS)
npm run ios

# Ejecutar en web
npm run web
```

## Próximos pasos

1. Configura Supabase para guardar puntuaciones
2. Invita amigos a jugar y compite en el leaderboard
3. Intenta mejorar tu récord personal
4. Reporta bugs o sugiere mejoras en GitHub

---

**¡Diviértete jugando!** ✈️
