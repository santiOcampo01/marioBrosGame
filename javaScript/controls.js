import { playAudio } from './audio.js'

// objeto para alternar las animaciones de mario grande y mario pequeño
const MARIO_ANIMATIONS = {
  marioGrown: {
    idle: 'marioGrownIdle',
    walk: 'marioGrownWalk',
    jump: 'marioGrownJump',
    crouch: 'marioGrownCrouch',
  },
  marioFire: {
    idle: 'marioFireIdle',
    walk: 'marioFireWalk',
    jump: 'marioFireJump',
    crouch: 'marioFireCrouch',
    attack: 'marioFireAttack',
  },
  mario: {
    idle: 'marioIdle',
    walk: 'marioWalk',
    jump: 'marioJump',
    dead: 'marioDead',
  },
}
export const controls = game => {
  const { keys, mario } = game

  //constantes para leer mejor el codigo
  const isMarioOnFloor = mario.body.touching.down // mario esta en el suelo
  //teclas de movimiento
  const isKeyLeftDown = keys.left.isDown // tecla izquierda
  const isKeyRightDown = keys.right.isDown // tecla derecha
  const isKeyJumpDown = keys.space.isDown // tecla de salto
  const isKeyDown = keys.down.isDown // tecla hacia abajo
  const isKeyFireDown = keys.shift.isDown // tecla de fuego

  //velocidad y salto de mario
  const velocityX = 150
  const jumpForce = -300

  if (mario.isDead) return // si mario esta muerto no hacemos nada
  if (mario.isBlocked) return // si mario esta bloqueado no hacemos nada

  // si mario es grande usamos las animaciones de mario grande, si no usamos las de mario pequeño
  let marioAnimations
  if (mario.isGrown && mario.isFire) {
    marioAnimations = MARIO_ANIMATIONS.marioFire
  } else if (mario.isGrown && !mario.isFire) {
    marioAnimations = MARIO_ANIMATIONS.marioGrown
  } else {
    marioAnimations = MARIO_ANIMATIONS.mario
  }

  if (mario.isGrown) mario.body.setSize(10, 32) // si mario es grande cambiamos el tamaño del cuerpo de mario para que se ajuste al sprite de mario grande

  if (isKeyLeftDown) {
    // lecha izquierda
    if (isMarioOnFloor) mario.anims.play(marioAnimations.walk, true) // reproducimos la animacion de caminar cuando mario esta en el suelo
    mario.setVelocityX(-velocityX) // movemos a mario hacia la izquierda
    mario.flipX = true // giramos a mario hacia la izquierda para que mire hacia ese lado
  } else if (isKeyRightDown) {
    //flecha derecha
    if (isMarioOnFloor) mario.anims.play(marioAnimations.walk, true) // reproducimos la animacion de caminar cuando mario esta en el suelo
    mario.setVelocityX(velocityX) // movemos a mario hacia la derecha
    mario.flipX = false // giramos a mario hacia la derecha para que mire hacia ese lado
  } else if (isKeyDown && mario.isGrown) {
    // flecha hacia y mario grande
    mario.anims.play(marioAnimations.crouch, true) // reproducimos la animacion de agacharse
    mario.setVelocityX(0) // detenemos a mario
    mario.body.setSize(10, 16) // ajustamos el tamaño para que se ajuste al sprite de mario agachado
    mario.body.setOffset(0, 16) // ajustamos el offset para que la colision se ajuste en los pies de mario agachado
  } else if (isMarioOnFloor) {
    //mario quieto
    mario.setVelocityX(0) // detenemos a mario
    mario.anims.play(marioAnimations.idle, true) // reproducimos la animacion de estar quieto
  }

  if (isKeyJumpDown && isMarioOnFloor) {
    // espacio y que mario este en el suelo
    mario.setVelocityY(jumpForce) // hacemos que mario salte
    mario.anims.play(marioAnimations.jump, true) // reproducimos la animacion de salto
    playAudio('marioJumpSound', game, { volume: 0.2 }) // reproducimos el sonido de salto
  }
  if (mario.isFire && isKeyFireDown) {
    // si mario tiene fuego y pulsa la tecla de fuego
    mario.anims.play(marioAnimations.attack, true) // reproducimos la animacion de ataque
    game.createFireBall(game) // lanzamos una bola de fuego
  }
}
