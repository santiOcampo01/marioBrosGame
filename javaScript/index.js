import { createAnimations } from './animations.js'
import { controls } from './controls.js'
import { loadImages } from './images.js'
import { initAudio, playAudio } from './audio.js'
import { spriteSheets } from './spritesSheets.js'


//Configuracion de Phaser
const config = {
  type: Phaser.AUTO, // primero intenta con WebGL, sino usa canvas
  width: 256, // ancho del canvas
  height: 244,  // alto del canvas
  backgroundColor: '#049cd8', // color de fondo del canvas
  parent: 'gameCanvas', // id del elemento HTML donde se renderiza el juego
  physics: {  //las fisicas del juego que usaremos en este caso arcade
    default: 'arcade',
    arcade: {
      gravity: { y: 300 }, // gravedad en el eje y
      debug: true, // habilita el modo debug para ver colisiones
    },
  },
  scene: { // escena del juego
    preload, // carga los recursos
    create, // crea los objetos del juego
    update, // actualiza cada frame
  },
}

new Phaser.Game(config) 

function preload() { 
  loadImages(this) // carga las imagenes
  spriteSheets(this) // carga los spritesheets
  initAudio(this)  // carga del audio
}

function create() {
  createAnimations(this) //inicializa las animaciones

  this.add.image(100, 20, 'cloud1').setOrigin(0, 0).setScale(0.15)

  this.floor = this.physics.add.staticGroup() //grupo estatico para el suelo
  this.floor
    .create(0, config.height - 16, 'floorBricks')
    .setOrigin(0, 0.5)
    .refreshBody() //primer bloque del suelo

  this.floor
    .create(170, config.height - 16, 'floorBricks')
    .setOrigin(0, 0.5)
    .refreshBody() //segundo bloque del suelo

  this.mario = this.physics.add.sprite(50, 100, 'mario').setOrigin(0, 1).setCollideWorldBounds(true).setGravityY(300) //inicializa a mario

  this.enemy = this.physics.add
    .sprite(100, config.height - 32, 'goomba')
    .setOrigin(0, 1)
    .setGravityY(300)
    .setGravityX(-50) //inicializa  un enemigo en este caso goomba

  this.enemy.anims.play('goombaWalk', true) //animacion de goomba

  this.collectibes = this.physics.add.staticGroup() //grupo estatico para los objetos coleccionables
  this.collectibes.create(150, 150, 'coin').anims.play('coinIdle', true).setOrigin(0.5, 0.5) //monedas
  this.collectibes.create(300, 150, 'coin').anims.play('coinIdle', true).setOrigin(0.5, 0.5) //monedas

  this.collectibes.create(200, config.height - 40, 'superMushroom') //super champiñon

  this.physics.add.overlap(this.mario, this.collectibes, collectItem, null, this) //colision entre mario y los objetos coleccionables

  this.physics.world.setBounds(0, 0, 2000, config.height) // establece los limites del mundo del juego

  this.physics.add.collider(this.mario, this.floor) //colision entre mario y el suelo

  this.physics.add.collider(this.enemy, this.floor) //colision entre los enemigos y el suelo

  this.physics.add.collider(this.mario, this.enemy, onHitEnemy, null, this) //colision entre mario y los enemigos

  this.cameras.main.setBounds(0, 0, 2000, config.height) // establece los limites de la camara

  this.cameras.main.startFollow(this.mario) // hace que la camara siga a mario

  this.keys = this.input.keyboard.createCursorKeys()  

  function collectItem(mario, item) {
    const { texture: { key } } = item // desestructuramos el key de la textura del item
    item.destroy() // destruimos el item al recogerlo

    if (key === 'coin') { 
      playAudio('coinCollect', this, { volume: 0.1 }) // reproducimos el sonido de la moneda
      addToScore(100, item, this)  // añadimos los puntos con la funcion addToScore
    } else if (key === 'superMushroom') {
      this.physics.world.pause() // pausamos el mundo
      this.anims.pauseAll() // pausamos todas las animaciones
      playAudio('marioPowerUp', this, { volume: 0.1 }) // reproducimos el sonido de power up
      mario.isBlocked = true // bloqueamos a mario para que no se mueva

      let i = 0 
      let interval = setInterval(() => { 
        mario.anims.play(i % 2 === 0 ? 'marioIdle' : 'marioGrownIdle') // alternamos entre las animaciones de mario grande y pequeño
        i++
      }, 100)

      setTimeout(() => {
        mario.setDisplaySize(18, 32) // cambiamos el tamaño de mario para que se ajuste a el sprite de mario grande
        mario.body.setSize(18, 32) // cambiamos la colision de mario para que se ajuste al sprite de mario grande
        mario.isGrown = true // marcamos a mario como grande 
        clearInterval(interval) // limpiamos el intervalo para que no se repita
        mario.isBlocked = false // desbloqueamos a mario
        this.physics.world.resume() // reanudamos el mundo
        this.anims.resumeAll() // reanudamos todas las animaciones
      }, 1000)
    }
  }

  function addToScore(scoreToAdd, origin, game) {
    const scoreText = game.add.text( // creamos el texto del puntaje con la posicion del objeto donde se recogio y le ponemos la letra y el tamaño
        origin.x, 
        origin.y, 
        scoreToAdd, 
        { fontFamily: 'pixel',
          fontSize: config.width / 40 
        }
    ) 

    game.tweens.add({ //usamos la animaciones de phaser tweens para hacer que el texto se mueva hacia arriba y desaparezca
      targets: scoreText,
      duration: 500,
      y: scoreText.y - 20,
      onComplete: () => {
        game.tweens.add({
          targets: scoreText,
          duration: 100,
          alpha: 0,
          onComplete: () => {
            scoreText.destroy() // destruimos el texto al finalizar la animacion
          },
        })
      },
    })
  }

  function onHitEnemy(mario, enemy) {
    if (mario.body.touching.down && enemy.body.touching.up) { // si mario toca al enemigo desde arriba lo matamos
      enemy.anims.play('goombaDead', true) // reproducimos la animacion de muerte del enemigo
      mario.setVelocityY(-200) // hacemos que mario salte
      enemy.setVelocityX(0) // detenemos al enemigo
      playAudio('goombaStomp', this) // reproducimos el sonido de stomp
      addToScore(200, enemy, this)
      setTimeout(() => {
        enemy.destroy() // destruimos al enemigo despues de un tiempo
      }, 500)
    } else {
      killMario(this) // si mario toca al enemigo desde los lados o abajo lo matamos con la funcion killMario
    }
  }
}

function update() {
  const { mario } = this //desestructuramos a mario de this
  controls(this) // llamamos a la funcion de controles
  if (mario.y >= config.height) {
    killMario(this) // si mario se cae del suelo a el vacio lo matamos
  }
}

function killMario(game) { 
  const { mario, scene } = game // desestructuramos a mario y la escena de el juego

  if (mario.isDead) return // si mario ya esta muerto no hacemos nada
  mario.isDead = true // marcamos a mario como muerto
  mario.anims.play('marioDead', true) // reproducimos la animacion de muerte de mario
  mario.setCollideWorldBounds(false) // hacemos que mario no colisione con los limites del mundo para que caiga al vacio 
  playAudio('gameOver', game, { volume: 0.2 }) // reproducimos el sonido de game over

  mario.body.checkCollision.none = true // desactivamos las colisiones de mario para que no colisione con nada
  mario.setVelocityX(0) // detenemos a mario
  setTimeout(() => {
    mario.setVelocityY(-300) // hacemos que mario salte hacia arriba para simular una caida
  }, 100)

  setTimeout(() => {
    scene.restart() // reiniciamos la escena despues de un tiempo para que el jugador pueda volver a jugar
  }, 2000)
}
