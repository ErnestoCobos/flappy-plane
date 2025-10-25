import { Audio } from 'expo-av';

class AudioService {
  constructor() {
    this.sounds = {};
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      this.initialized = true;
    } catch (error) {
      console.error('Error al inicializar audio:', error);
    }
  }

  async loadSound(key, source) {
    try {
      const { sound } = await Audio.Sound.createAsync(source);
      this.sounds[key] = sound;
    } catch (error) {
      console.error(`Error al cargar sonido ${key}:`, error);
    }
  }

  async playSound(key) {
    try {
      if (this.sounds[key]) {
        await this.sounds[key].replayAsync();
      }
    } catch (error) {
      console.error(`Error al reproducir sonido ${key}:`, error);
    }
  }

  async unloadAll() {
    try {
      for (const key in this.sounds) {
        if (this.sounds[key]) {
          await this.sounds[key].unloadAsync();
        }
      }
      this.sounds = {};
    } catch (error) {
      console.error('Error al descargar sonidos:', error);
    }
  }

  // Generar sonidos programáticamente si no hay archivos de audio
  async generateBeep(frequency = 440, duration = 100) {
    // Nota: Este es un placeholder. En producción, usarías archivos de audio reales
    // o una biblioteca como expo-tone para generar tonos
    console.log(`Beep generado: ${frequency}Hz por ${duration}ms`);
  }
}

export const audioService = new AudioService();
