// objeto para inicializar los spritesheets
const INIT_SPRITESHEET = [
  {
    key: 'mario',
    path: 'assets/entities/mario.png',
    frameWidth: 18,
    frameHeight: 16,
  },
  {
    key: 'marioGrown',
    path: 'assets/entities/mario-grown.png',
    frameWidth: 18,
    frameHeight: 32,
  },
  {
    key: 'marioFire',
    path: 'assets/entities/mario-fire.png',
    frameWidth: 18,
    frameHeight: 32,
  },
  {
    key: 'goomba',
    path: 'assets/entities/overworld/goomba.png',
    frameWidth: 16,
    frameHeight: 16,
  },
  {
    key: 'coin',
    path: 'assets/collectibles/coin.png',
    frameWidth: 16,
    frameHeight: 16,
  },
  {
    key: 'misteryBlock',
    path: 'assets/blocks/overworld/misteryBlock.png',
    frameWidth: 16,
    frameHeight: 16,
  },
  {
    key: 'blockDestroyed',
    path: 'assets/blocks/overworld/brick-debris.png',
    frameWidth: 8,
    frameHeight: 8,
  },
  {
    key: 'fireFlower',
    path: 'assets/collectibles/overworld/fire-flower.png',
    frameWidth: 16,
    frameHeight: 16,
  },
  {
    key: 'marioFireBall',
    path: 'assets/entities/fireball.png',
    frameWidth: 8,
    frameHeight: 8,
  },
  {
    key: 'fireBallExplosion',
    path: 'assets/entities/fireball-explosion.png',
    frameWidth: 16,
    frameHeight: 16,
  },
]

// funcion para cargar los spritesheets recorriendo el objeto INIT_SPRITESHEET donde esta su key, path, frameWidth y frameHeight
export const spriteSheets = ({ load }) => { 
    INIT_SPRITESHEET.forEach(({ key, path, frameWidth, frameHeight }) => {
        load.spritesheet(key, path, { frameWidth, frameHeight }) // cargamos el spritesheet con su key, path, frameWidth y frameHeight
    }) 
}
