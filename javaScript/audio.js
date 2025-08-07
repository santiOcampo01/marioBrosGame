//array de objetos con la key y el path de los audios que se van a cargar
const INIT_AUDIO = [
  { key: 'gameOver', path: 'assets/sound/music/gameover.mp3' },
  { key: 'marioJumpSound', path: 'assets/sound/effects/jump.mp3' },
  { key: 'marioPowerDown', path: 'assets/sound/effects/powerdown.mp3' },
  { key: 'goombaStomp', path: 'assets/sound/effects/goomba-stomp.wav' },
  { key: 'overWorld', path: 'assets/sound/music/overworld/theme.mp3' },
  { key: 'coinCollect', path: 'assets/sound/effects/coin.mp3' },
  { key: 'marioPowerUp', path: 'assets/sound/effects/consume-powerup.mp3' },
  { key: 'blockBreak', path: 'assets/sound/effects/break-block.wav' },
  { key: 'blockBump', path: 'assets/sound/effects/block-bump.wav' },
  { key: 'fireballSound', path: 'assets/sound/effects/fireball.mp3' },
]

// funcion para cargar los audios recorriendo el objeto INIT_AUDIO donde esta su key y path
export const initAudio = ({ load }) => {
  INIT_AUDIO.forEach(({ key, path }) => {
    load.audio(key, path)
  })
}

// funcion para reproducir el audio con su id, contexto y opciones de volumen
export const playAudio = (id, { sound }, { volume = 1 } = {}) => {
  try {
    return sound.add(id, { volume }).play()
  } catch (error) {
    console.error(`Error playing audio ${id}:`, error)
  }
}
