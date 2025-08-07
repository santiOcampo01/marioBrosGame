//cargamos las animaciones del juego
export const createAnimations = game => {
  game.anims.create({
    key: 'marioIdle',
    frames: [{ key: 'mario', frame: 0 }],
    frameRate: 12,
    repeat: -1,
  })

  game.anims.create({
    key: 'marioWalk',
    frames: game.anims.generateFrameNumbers('mario', { start: 3, end: 1 }),
    frameRate: 12,
    repeat: -1,
  })

  game.anims.create({
    key: 'marioJump',
    frames: [{ key: 'mario', frame: 5 }],
  })

  game.anims.create({
    key: 'marioDead',
    frames: [{ key: 'mario', frame: 4 }],
  })

  game.anims.create({
    key: 'marioGrownIdle',
    frames: [{ key: 'marioGrown', frame: 0 }],
  })

  game.anims.create({
    key: 'marioGrownWalk',
    frames: game.anims.generateFrameNumbers('marioGrown', { start: 3, end: 1 }),
    frameRate: 12,
    repeat: -1,
  })

  game.anims.create({
    key: 'marioGrownJump',
    frames: [{ key: 'marioGrown', frame: 5 }],
  })

  game.anims.create({
    key: 'marioGrownCrouch',
    frames: [{ key: 'marioGrown', frame: 4 }],
  })

  game.anims.create({
    key: 'goombaWalk',
    frames: game.anims.generateFrameNumbers('goomba', { start: 0, end: 1 }),
    frameRate: 12,
    repeat: -1,
  })

  game.anims.create({
    key: 'goombaDead',
    frames: [{ key: 'goomba', frame: 2 }],
    frameRate: 12,
    repeat: -1,
  })

  game.anims.create({
    key: 'coinIdle',
    frames: game.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
    frameRate: 12,
    repeat: -1,
  })

  game.anims.create({
    key: 'misteryBlockIdle',
    frames: game.anims.generateFrameNumbers('misteryBlock', { start: 0, end: 2 }),
    frameRate: 3,
    repeat: -1,
  })
  game.anims.create({
    key: 'emptyBlockIdle',
    frames: [{ key: 'emptyBlock', frame: 0 }],
  })
  game.anims.create({
    key: 'fireFlowerIdle',
    frames: game.anims.generateFrameNumbers('fireFlower', { start: 0, end: 2 }),
    frameRate: 12,
    repeat: -1,
  })

  game.anims.create({
    key: 'marioFireIdle',
    frames: [{ key: 'marioFire', frame: 0 }],
  })

  game.anims.create({
    key: 'marioFireWalk',
    frames: game.anims.generateFrameNumbers('marioFire', { start: 3, end: 1 }),
    frameRate: 12,
    repeat: -1,
  })

  game.anims.create({
    key: 'marioFireJump',
    frames: [{ key: 'marioFire', frame: 5 }],
  })

  game.anims.create({
    key: 'marioFireCrouch',
    frames: [{ key: 'marioFire', frame: 4 }],
  })
  game.anims.create({
    key: 'marioFireAttack',
    frames: [{ key: 'marioFire', frame: 6 }],
  })

  game.anims.create({
    key: 'fireBallMove',
    frames: game.anims.generateFrameNumbers('marioFireBall', { start: 0, end: 3 }),
    frameRate: 12,
    repeat: -1,
  })

  game.anims.create({
    key: 'fireBallExplosion',
    frames: game.anims.generateFrameNumbers('fireBallExplosion', { start: 0, end: 2 }),
    frameRate: 15,
    repeat: 0,
  })
}
