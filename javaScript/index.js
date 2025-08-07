import { createAnimations } from './animations.js'
import { controls } from './controls.js'
import { loadImages } from './images.js'
import { initAudio, playAudio } from './audio.js'
import { spriteSheets } from './spritesSheets.js'
import { createScenery, staticsBlocks } from './scenery.js'

//Configuracion de Phaser
const config = {
  type: Phaser.AUTO, // primero intenta con WebGL, sino usa canvas
  width: 256, // ancho del canvas
  height: 244, // alto del canvas
  backgroundColor: '#049cd8', // color de fondo del canvas
  parent: 'gameCanvas', // id del elemento HTML donde se renderiza el juego
  physics: {
    //las fisicas del juego que usaremos en este caso arcade
    default: 'arcade',
    arcade: {
      gravity: { y: 300 }, // gravedad en el eje y
      debug: true, // habilita el modo debug para ver colisiones
    },
  },
  scene: {
    // escena del juego
    preload, // carga los recursos
    create, // crea los objetos del juego
    update, // actualiza cada frame
  },
}

new Phaser.Game(config)

let scoreText, coinsText, livesText, worldText, timeText
let score = 0,
  coins = 0,
  lives = 3,
  world = '1-1',
  remainingTime = 400

function preload() {
  loadImages(this) // carga las imagenes
  spriteSheets(this) // carga los spritesheets
  initAudio(this) // carga del audio
}

function create() {
  createAnimations(this) //inicializa las animaciones

  const style = {
    fontFamily: 'pixel',
    fontSize: config.width / 25,
    resolution: 50,
  }

  scoreText = this.add.text(10, 10, 'MARIO \n00000', style).setScrollFactor(0)
  coinsText = this.add.text(70, 15, 'x00', style).setScrollFactor(0)
  worldText = this.add.text(130, 10, 'Mundo \n 1-1', style).setScrollFactor(0)
  timeText = this.add.text(190, 10, 'Tiempo \n 400', style).setScrollFactor(0)

  this.time.addEvent({
    delay: 1000,
    loop: true,
    callback: () => {
      remainingTime--
      timeText.setText('Tiempo \n  ' + remainingTime)
    },
  })

  this.add.image(170, 50, 'cloud2').setOrigin(0, 0).setScale(0.15)
  this.add.image(450, 50, 'cloud1').setOrigin(0, 0).setScale(0.15)
  this.add
    .image(150, config.height - 32, 'bush1')
    .setOrigin(0, 1)
    .setScale(0.7)
  this.add
    .image(2319, config.height - 32, 'bush1')
    .setOrigin(0, 1)
    .setScale(0.5)
  this.add
    .image(1026, config.height - 32, 'bush1')
    .setOrigin(0, 1)
    .setScale(0.7)
  this.add
    .image(195, config.height - 32, 'bush1')
    .setOrigin(0, 1)
    .setScale(0.7)
  this.add
    .image(1505, config.height - 32, 'bush1')
    .setOrigin(0, 1)
    .setScale(0.7)
  this.add
    .image(1800, config.height - 32, 'bush1')
    .setOrigin(0, 1)
    .setScale(0.7)
  this.add
    .image(2850, config.height - 32, 'bush2')
    .setOrigin(0, 1)
    .setScale(0.7)
  this.add
    .image(400, config.height - 32, 'bush2')
    .setOrigin(0, 1)
    .setScale(0.7)
  this.add
    .image(680, config.height - 32, 'bush2')
    .setOrigin(0, 1)
    .setScale(0.7)
  this.add
    .image(1185, config.height - 32, 'bush2')
    .setOrigin(0, 1)
    .setScale(0.7)
  this.add
    .image(256, config.height - 32, 'mountain1')
    .setOrigin(0, 1)
    .setScale(0.7)
  this.add
    .image(1880, config.height - 32, 'mountain1')
    .setOrigin(0, 1)
    .setScale(0.7)
  this.add
    .image(2695, config.height - 32, 'mountain1')
    .setOrigin(0, 1)
    .setScale(0.7)
  this.add
    .image(3254, config.height - 32, 'mountain2')
    .setOrigin(0, 1)
    .setScale(0.7)
  this.add
    .image(830, config.height - 32, 'mountain2')
    .setOrigin(0, 1)
    .setScale(0.55)
  this.add
    .image(0, config.height - 32, 'mountain2')
    .setOrigin(0, 1)
    .setScale(0.55)
  this.add
    .image(2420, config.height - 32, 'mountain2')
    .setOrigin(0, 1)
    .setScale(0.55)
  this.add
    .image(1620, config.height - 32, 'mountain2')
    .setOrigin(0, 1)
    .setScale(0.55)

  let tubes = this.physics.add.staticGroup()
  tubes.create(500, config.height - 48, 'smallTube').setOrigin(0.5, 0.5)
  tubes.create(660, config.height - 56, 'mediumTube').setOrigin(0.5, 0.5)
  tubes.create(820, config.height - 64, 'largeTube').setOrigin(0.5, 0.5)
  tubes.create(1000, config.height - 64, 'largeTube').setOrigin(0.5, 0.5)
  tubes.create(2778, config.height - 48, 'smallTube').setOrigin(0.5, 0.5)
  tubes.create(3080, config.height - 48, 'smallTube').setOrigin(0.5, 0.5)

  this.mario = this.physics.add
    .sprite(10, config.height - 80, 'mario')
    .setOrigin(0, 1)
    .setSize(10, 15)
    .setCollideWorldBounds(true)
    .setGravityY(300) //inicializa a mario

  // Propiedades adicionales de Mario
  this.mario.isDead = false
  this.mario.isBlocked = false
  this.mario.isGrown = false
  this.mario.isFire = false
  this.mario.lastFireTime = 0

  // Crear grupo de enemigos para manejar múltiples Goombas
  this.enemies = this.physics.add.group()

  // Crear Goombas en diferentes posiciones estratégicas
  this.enemy1 = this.enemies
    .create(300, config.height - 32, 'goomba')
    .setOrigin(0, 1)
    .setGravityY(300)
    .setVelocityX(-30) // velocidad más realista como en el original
    .setCollideWorldBounds(false) // no rebotar en los límites
    .setBounce(0, 0)

  this.enemy2 = this.enemies
    .create(450, config.height - 32, 'goomba')
    .setOrigin(0, 1)
    .setGravityY(300)
    .setVelocityX(-25)
    .setCollideWorldBounds(false)
    .setBounce(0, 0)

  this.enemy3 = this.enemies
    .create(900, config.height - 32, 'goomba')
    .setOrigin(0, 1)
    .setGravityY(300)
    .setVelocityX(-35)
    .setCollideWorldBounds(false)
    .setBounce(0, 0)

  this.enemy4 = this.enemies
    .create(1200, config.height - 32, 'goomba')
    .setOrigin(0, 1)
    .setGravityY(300)
    .setVelocityX(-30)
    .setCollideWorldBounds(false)
    .setBounce(0, 0)

  this.enemy5 = this.enemies
    .create(1600, config.height - 32, 'goomba')
    .setOrigin(0, 1)
    .setGravityY(300)
    .setVelocityX(-28)
    .setCollideWorldBounds(false)
    .setBounce(0, 0)

  this.enemy6 = this.enemies
    .create(2200, config.height - 32, 'goomba')
    .setOrigin(0, 1)
    .setGravityY(300)
    .setVelocityX(-32)
    .setCollideWorldBounds(false)
    .setBounce(0, 0)

  // Propiedades adicionales para cada Goomba
  this.enemies.children.entries.forEach(enemy => {
    enemy.isDead = false
    enemy.direction = -1 // -1 = izquierda, 1 = derecha
    enemy.speed = Math.abs(enemy.body.velocity.x) // usar la velocidad que se le asignó
    enemy.anims.play('goombaWalk', true)
  })
  let floorGroup = this.physics.add.staticGroup()
  createScenery(0, config.height - 16, 'floorBricks', floorGroup)
  createScenery(128, config.height - 16, 'floorBricks', floorGroup)
  createScenery(256, config.height - 16, 'floorBricks', floorGroup)
  createScenery(384, config.height - 16, 'floorBricks', floorGroup)
  createScenery(512, config.height - 16, 'floorBricks', floorGroup)
  createScenery(640, config.height - 16, 'floorBricks', floorGroup)
  createScenery(768, config.height - 16, 'floorBricks', floorGroup)
  createScenery(895, config.height - 16, 'floorBricks', floorGroup)
  createScenery(1023, config.height - 16, 'floorBricks', floorGroup)
  createScenery(1181, config.height - 16, 'floorBricks', floorGroup)
  createScenery(1309, config.height - 16, 'floorBricks', floorGroup)
  createScenery(1500, config.height - 16, 'floorBricks', floorGroup)
  createScenery(1628, config.height - 16, 'floorBricks', floorGroup)
  createScenery(1756, config.height - 16, 'floorBricks', floorGroup)
  createScenery(1884, config.height - 16, 'floorBricks', floorGroup)
  createScenery(2012, config.height - 16, 'floorBricks', floorGroup)
  createScenery(2140, config.height - 16, 'floorBricks', floorGroup)
  createScenery(2268, config.height - 16, 'floorBricks', floorGroup)
  createScenery(2396, config.height - 16, 'floorBricks', floorGroup)
  createScenery(2456, config.height - 16, 'floorBricks', floorGroup)
  createScenery(2625, config.height - 16, 'floorBricks', floorGroup)
  createScenery(2753, config.height - 16, 'floorBricks', floorGroup)
  createScenery(2881, config.height - 16, 'floorBricks', floorGroup)
  createScenery(3009, config.height - 16, 'floorBricks', floorGroup)
  createScenery(3137, config.height - 16, 'floorBricks', floorGroup)
  createScenery(3265, config.height - 16, 'floorBricks', floorGroup)
  createScenery(3392, config.height - 16, 'floorBricks', floorGroup)

  let blocks = this.physics.add.staticGroup()
  staticsBlocks(264, 150, 'misteryBlock', blocks)
  staticsBlocks(350, 150, 'brickBlock', blocks)
  staticsBlocks(366, 150, 'misteryBlock', blocks, 'collectible')
  staticsBlocks(382, 150, 'brickBlock', blocks)
  staticsBlocks(398, 150, 'misteryBlock', blocks)
  staticsBlocks(414, 150, 'brickBlock', blocks)
  staticsBlocks(382, 80, 'misteryBlock', blocks)

  staticsBlocks(1287, 150, 'brickBlock', blocks)
  staticsBlocks(1303, 150, 'misteryBlock', blocks, 'collectible')
  staticsBlocks(1319, 150, 'brickBlock', blocks)
  staticsBlocks(1334, 80, 'brickBlock', blocks)

  staticsBlocks(1350, 80, 'brickBlock', blocks)
  staticsBlocks(1366, 80, 'brickBlock', blocks)
  staticsBlocks(1382, 80, 'brickBlock', blocks)
  staticsBlocks(1398, 80, 'brickBlock', blocks)
  staticsBlocks(1414, 80, 'brickBlock', blocks)
  staticsBlocks(1430, 80, 'brickBlock', blocks)
  staticsBlocks(1446, 80, 'brickBlock', blocks)
  staticsBlocks(1462, 80, 'brickBlock', blocks)
  staticsBlocks(1532, 80, 'brickBlock', blocks)
  staticsBlocks(1548, 80, 'brickBlock', blocks)
  staticsBlocks(1564, 80, 'brickBlock', blocks)
  staticsBlocks(1580, 80, 'brickBlock', blocks)
  staticsBlocks(1596, 80, 'misteryBlock', blocks)
  staticsBlocks(1596, 150, 'brickBlock', blocks)
  staticsBlocks(1700, 150, 'brickBlock', blocks)
  staticsBlocks(1716, 150, 'brickBlock', blocks)
  staticsBlocks(1800, 150, 'misteryBlock', blocks)
  staticsBlocks(1850, 150, 'misteryBlock', blocks)
  staticsBlocks(1900, 150, 'misteryBlock', blocks)
  staticsBlocks(1850, 80, 'misteryBlock', blocks)
  staticsBlocks(2000, 150, 'brickBlock', blocks)
  staticsBlocks(2048, 80, 'brickBlock', blocks)
  staticsBlocks(2064, 80, 'brickBlock', blocks)
  staticsBlocks(2080, 80, 'brickBlock', blocks)
  staticsBlocks(2160, 80, 'brickBlock', blocks)
  staticsBlocks(2176, 80, 'misteryBlock', blocks)
  staticsBlocks(2192, 80, 'misteryBlock', blocks)
  staticsBlocks(2176, 150, 'brickBlock', blocks)
  staticsBlocks(2192, 150, 'brickBlock', blocks)
  staticsBlocks(2208, 80, 'brickBlock', blocks)
  staticsBlocks(2870, 150, 'brickBlock', blocks)
  staticsBlocks(2886, 150, 'brickBlock', blocks)
  staticsBlocks(2902, 150, 'misteryBlock', blocks)
  staticsBlocks(2918, 150, 'brickBlock', blocks)
  staticsBlocks(2272, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(2288, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(2304, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(2320, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(2288, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(2304, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(2320, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(2304, config.height - 72, 'staticBlock', blocks)
  staticsBlocks(2320, config.height - 72, 'staticBlock', blocks)
  staticsBlocks(2320, config.height - 88, 'staticBlock', blocks)
  staticsBlocks(2368, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(2384, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(2400, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(2416, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(2368, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(2384, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(2400, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(2368, config.height - 72, 'staticBlock', blocks)
  staticsBlocks(2384, config.height - 72, 'staticBlock', blocks)
  staticsBlocks(2368, config.height - 88, 'staticBlock', blocks)
  staticsBlocks(2512, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(2528, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(2544, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(2560, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(2576, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(2528, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(2544, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(2560, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(2576, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(2544, config.height - 72, 'staticBlock', blocks)
  staticsBlocks(2560, config.height - 72, 'staticBlock', blocks)
  staticsBlocks(2576, config.height - 72, 'staticBlock', blocks)
  staticsBlocks(2560, config.height - 88, 'staticBlock', blocks)
  staticsBlocks(2576, config.height - 88, 'staticBlock', blocks)
  staticsBlocks(2633, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(2649, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(2665, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(2681, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(2633, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(2649, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(2665, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(2633, config.height - 72, 'staticBlock', blocks)
  staticsBlocks(2649, config.height - 72, 'staticBlock', blocks)
  staticsBlocks(2633, config.height - 88, 'staticBlock', blocks)
  staticsBlocks(3106, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(3122, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(3138, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(3154, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(3170, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(3186, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(3202, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(3218, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(3234, config.height - 40, 'staticBlock', blocks)
  staticsBlocks(3122, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(3138, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(3154, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(3170, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(3186, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(3202, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(3218, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(3234, config.height - 56, 'staticBlock', blocks)
  staticsBlocks(3138, config.height - 72, 'staticBlock', blocks)
  staticsBlocks(3154, config.height - 72, 'staticBlock', blocks)
  staticsBlocks(3170, config.height - 72, 'staticBlock', blocks)
  staticsBlocks(3186, config.height - 72, 'staticBlock', blocks)
  staticsBlocks(3202, config.height - 72, 'staticBlock', blocks)
  staticsBlocks(3218, config.height - 72, 'staticBlock', blocks)
  staticsBlocks(3234, config.height - 72, 'staticBlock', blocks)
  staticsBlocks(3154, config.height - 88, 'staticBlock', blocks)
  staticsBlocks(3170, config.height - 88, 'staticBlock', blocks)
  staticsBlocks(3186, config.height - 88, 'staticBlock', blocks)
  staticsBlocks(3202, config.height - 88, 'staticBlock', blocks)
  staticsBlocks(3218, config.height - 88, 'staticBlock', blocks)
  staticsBlocks(3234, config.height - 88, 'staticBlock', blocks)
  staticsBlocks(3170, config.height - 104, 'staticBlock', blocks)
  staticsBlocks(3186, config.height - 104, 'staticBlock', blocks)
  staticsBlocks(3202, config.height - 104, 'staticBlock', blocks)
  staticsBlocks(3218, config.height - 104, 'staticBlock', blocks)
  staticsBlocks(3234, config.height - 104, 'staticBlock', blocks)
  staticsBlocks(3186, config.height - 120, 'staticBlock', blocks)
  staticsBlocks(3202, config.height - 120, 'staticBlock', blocks)
  staticsBlocks(3218, config.height - 120, 'staticBlock', blocks)
  staticsBlocks(3234, config.height - 120, 'staticBlock', blocks)
  staticsBlocks(3202, config.height - 136, 'staticBlock', blocks)
  staticsBlocks(3218, config.height - 136, 'staticBlock', blocks)
  staticsBlocks(3234, config.height - 136, 'staticBlock', blocks)
  staticsBlocks(3218, config.height - 152, 'staticBlock', blocks)
  staticsBlocks(3234, config.height - 152, 'staticBlock', blocks)
  staticsBlocks(3400, config.height - 116, 'flagMast', blocks)
  staticsBlocks(3392, config.height - 182, 'flag', blocks)

  this.collectibes = this.physics.add.staticGroup() //grupo estatico para los objetos coleccionables
  this.collectibes.create(150, 150, 'coin').anims.play('coinIdle', true).setOrigin(0.5, 0.5) //monedas
  this.collectibes.create(300, 150, 'coin').anims.play('coinIdle', true).setOrigin(0.5, 0.5) //monedas

  this.collectibes.create(200, config.height - 40, 'superMushroom') //super champiñon

  this.collectibes.create(300, 150, 'coin').anims.play('coinIdle', true).setOrigin(0.5, 0.5)

  // Grupo de bolas de fuego
  this.fireBalls = this.physics.add.group()

  this.physics.add.overlap(this.mario, this.collectibes, collectItem, null, this) //colision entre mario y los objetos coleccionables

  this.physics.world.setBounds(0, 0, 4000, config.height) // establece los limites del mundo del juego

  this.physics.add.collider(this.mario, floorGroup) //colision entre mario y el suelo

  this.physics.add.collider(this.mario, tubes)

  // Colisiones de las bolas de fuego
  this.physics.add.collider(this.fireBalls, floorGroup, onFireBallHitGround, null, this)
  this.physics.add.collider(this.fireBalls, blocks, onFireBallHitBlock, null, this)
  this.physics.add.collider(this.fireBalls, tubes, onFireBallHitBlock, null, this)

  // Colisiones de enemigos
  this.physics.add.collider(this.enemies, floorGroup) //colision entre los enemigos y el suelo
  this.physics.add.collider(this.enemies, blocks, onEnemyHitBlock, null, this) // enemigos rebotan en bloques
  this.physics.add.collider(this.enemies, tubes, onEnemyHitBlock, null, this) // enemigos rebotan en tuberías
  this.physics.add.overlap(this.fireBalls, this.enemies, onFireBallHitEnemy, null, this) // bolas de fuego vs enemigos

  this.physics.add.collider(this.mario, this.enemies, onHitEnemy, null, this) //colision entre mario y los enemigos
  this.physics.add.collider(this.mario, blocks, collectBlocks, null, this)

  this.cameras.main.setBounds(0, 0, 4000, config.height) // establece los limites de la camara

  this.cameras.main.startFollow(this.mario) // hace que la camara siga a mario

  this.keys = this.input.keyboard.createCursorKeys()

  function collectBlocks(mario, block) {
    const {
      texture: { key },
    } = block
    if (key === 'misteryBlock') {
      if (mario.body.touching.up && block.body.touching.down) {
        if (block.contains === 'collectible') {
          if (!mario.isGrown) {
            let mushroom = this.collectibes.create(block.x, block.y - block.height, 'superMushroom')
            mushroom.y = block.y
            this.tweens.add({
              targets: mushroom,
              y: mushroom.y - block.height,
              duration: 500,
            })
            block.anims.play('emptyBlockIdle', true)
          } else {
            let fireFlower = this.collectibes.create(block.x, block.y - block.height, 'fireFlower').anims.play('fireFlowerIdle', true)
            block.anims.play('emptyBlockIdle', true)
          }
        } else {
          block.anims.play('emptyBlockIdle', true)
          this.tweens.add({
            targets: block,
            y: block.y - 5,
            duration: 100,
            yoyo: true,
          })
          const coin = this.physics.add.sprite(block.x, block.y, 'coin').anims.play('coinIdle', true).setOrigin(0.5, 0.5).setScale(1)
          coin.setVelocityY(-200)
          playAudio('coinCollect', this, { volume: 0.1 }) // reproduce el sonido de la moneda

          this.time.addEvent({
            delay: 500,
            callback: () => {
              coin.setVelocityY(150)
            },
          })

          this.time.addEvent({
            delay: 500,
            callback: () => {
              addToScore(100, coin, this)
              coin.destroy()
            },
          })
        }
      }
    } else if (key === 'brickBlock') {
      if (mario.body.touching.up && block.body.touching.down) {
        if (mario.isGrown) {
          playAudio('blockBreak', this)
          let fragment1 = this.physics.add
            .sprite(block.x - block.width / 2, block.y - block.height, 'blockDestroyed')
            .setOrigin(0.5, 0.5)
            .setScale(1)
          let fragment2 = this.physics.add
            .sprite(block.x + block.width / 2, block.y - block.height, 'blockDestroyed')
            .setOrigin(0.5, 0.5)
            .setScale(1)
          let fragment3 = this.physics.add
            .sprite(block.x - block.width / 2, block.y + 4, 'blockDestroyed')
            .setOrigin(0.5, 0.5)
            .setScale(1)
          let fragment4 = this.physics.add
            .sprite(block.x + block.width / 2, block.y + 4, 'blockDestroyed')
            .setOrigin(0.5, 0.5)
            .setScale(1)

          fragment1.setVelocityY(-90).setVelocityX(-50)
          fragment2.setVelocityY(-90).setVelocityX(50)
          fragment3.setVelocityY(-90).setVelocityX(-50)
          fragment4.setVelocityY(-90).setVelocityX(50)
          addToScore(100, block, this) // añadimos los puntos al romper el bloque
          this.time.addEvent({
            delay: 1000,
            callback: () => {
              fragment1.destroy()
              fragment2.destroy()
              fragment3.destroy()
              fragment4.destroy()
            },
          })
          block.destroy() // destruimos el bloque al romperlo
        } else {
          playAudio('blockBump', this)
          this.tweens.add({
            targets: block,
            y: block.y - 5,
            duration: 100,
            yoyo: true,
          })
        }
      }
    }
  }

  function collectItem(mario, item) {
    const {
      texture: { key },
    } = item // desestructuramos el key de la textura del item
    item.destroy() // destruimos el item al recogerlo

    if (key === 'coin') {
      playAudio('coinCollect', this, { volume: 0.1 }) // reproducimos el sonido de la moneda
      addToScore(100, item, this) // añadimos los puntos con la funcion addToScore
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
    } else if (key === 'fireFlower') {
      this.physics.world.pause() // pausamos el mundo
      this.anims.pauseAll() // pausamos todas las animaciones
      playAudio('marioPowerUp', this, { volume: 0.1 }) // reproducimos el sonido de power up
      mario.isBlocked = true // bloqueamos a mario para que no se mueva

      let i = 0
      let interval = setInterval(() => {
        mario.anims.play(i % 2 === 0 ? 'marioGrownIdle' : 'marioFireIdle') // alternamos entre las animaciones de mario grande y pequeño
        i++
      }, 100)

      setTimeout(() => {
        mario.setDisplaySize(18, 32) // cambiamos el tamaño de mario para que se ajuste a el sprite de mario grande
        mario.body.setSize(18, 32) // cambiamos la colision de mario para que se ajuste al sprite de mario grande
        mario.isFire = true // marcamos a mario como con fuego
        clearInterval(interval) // limpiamos el intervalo para que no se repita
        mario.isBlocked = false // desbloqueamos a mario
        this.physics.world.resume() // reanudamos el mundo
        this.anims.resumeAll() // reanudamos todas las animaciones
      }, 1000)
    }
  }

  function addToScore(scoreToAdd, origin, game) {
    const scoreText = game.add.text(
      // creamos el texto del puntaje con la posicion del objeto donde se recogio y le ponemos la letra y el tamaño
      origin.x,
      origin.y,
      scoreToAdd,
      { fontFamily: 'pixel', fontSize: config.width / 40 },
    )

    game.tweens.add({
      //usamos la animaciones de phaser tweens para hacer que el texto se mueva hacia arriba y desaparezca
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
    if (enemy.isDead) return // si el enemigo ya está muerto, no hacer nada

    if (mario.body.touching.down && enemy.body.touching.up) {
      // si mario toca al enemigo desde arriba lo matamos
      enemy.isDead = true
      enemy.anims.play('goombaDead', true) // reproducimos la animacion de muerte del enemigo
      mario.setVelocityY(-200) // hacemos que mario salte
      enemy.setVelocityX(0) // detenemos al enemigo
      enemy.setVelocityY(0) // detenemos movimiento vertical
      playAudio('goombaStomp', this) // reproducimos el sonido de stomp
      addToScore(200, enemy, this)

      setTimeout(() => {
        if (enemy.scene) {
          enemy.destroy() // destruimos al enemigo despues de un tiempo
        }
      }, 500)
    } else {
      killMario(this) // si mario toca al enemigo desde los lados o abajo lo matamos con la funcion killMario
    }
  }

  // Función cuando el enemigo toca un bloque o tubería
  function onEnemyHitBlock(enemy, block) {
    if (enemy.isDead) return

    // Cambiar dirección
    enemy.direction *= -1
    enemy.setVelocityX(enemy.direction * enemy.speed)
  }

  // Función cuando una bola de fuego toca un enemigo
  function onFireBallHitEnemy(fireBall, enemy) {
    if (enemy.isDead) return

    // Matar al enemigo
    enemy.isDead = true
    enemy.anims.play('goombaDead', true)
    enemy.setVelocityX(0)
    enemy.setVelocityY(0)
    playAudio('goombaStomp', fireBall.scene) // reproducimos el sonido de stomp
    addToScore(200, enemy, fireBall.scene)

    // Crear explosión de bola de fuego
    createFireBallExplosion(fireBall.x, fireBall.y, fireBall.scene)
    fireBall.destroy()

    setTimeout(() => {
      if (enemy.scene) {
        enemy.destroy()
      }
    }, 500)
  }

  // Función para crear bolas de fuego
  function createFireBall(game) {
    const { mario } = game
    const currentTime = game.time.now

    // Limitar la frecuencia de lanzamiento (cada 300ms)
    if (currentTime - mario.lastFireTime < 300) return

    mario.lastFireTime = currentTime

    // Crear la bola de fuego
    const fireBall = game.fireBalls.create(mario.x + (mario.flipX ? -10 : 10), mario.y - 16, 'marioFireBall')

    fireBall.setVelocityX(mario.flipX ? -200 : 200)
    fireBall.setVelocityY(-100)
    fireBall.setBounce(0.7)
    fireBall.setCollideWorldBounds(false)
    fireBall.anims.play('fireBallMove', true)

    // Reproducir sonido
    playAudio('fireballSound', game, { volume: 0.2 })

    // Destruir la bola de fuego después de 3 segundos
    game.time.addEvent({
      delay: 3000,
      callback: () => {
        if (fireBall && fireBall.scene) {
          fireBall.destroy()
        }
      },
    })
  }

  // Función cuando la bola de fuego toca el suelo
  function onFireBallHitGround(fireBall, ground) {
    // Solo rebotar una vez, luego continuar rodando
    if (fireBall.body.velocity.y > 0) {
      fireBall.setVelocityY(-150)
    }
  }

  // Función cuando la bola de fuego toca un bloque
  function onFireBallHitBlock(fireBall, block) {
    createFireBallExplosion(fireBall.x, fireBall.y, fireBall.scene)
    fireBall.destroy()
  }

  // Función para crear explosión de bola de fuego
  function createFireBallExplosion(x, y, scene) {
    const explosion = scene.physics.add.sprite(x, y, 'fireBallExplosion')
    explosion.anims.play('fireBallExplosion', true)

    explosion.on('animationcomplete', () => {
      explosion.destroy()
    })
  }

  // Exponer la función createFireBall para que pueda ser usada desde controls.js
  this.createFireBall = createFireBall
}

function update() {
  const { mario, fireBalls, enemies } = this //desestructuramos a mario, bolas de fuego y enemigos de this
  controls(this) // llamamos a la funcion de controles

  if (mario.y >= config.height) {
    killMario(this) // si mario se cae del suelo a el vacio lo matamos
  }

  // Actualizar comportamiento de los Goombas
  enemies.children.entries.forEach(enemy => {
    if (!enemy.isDead) {
      // Verificar si el Goomba se cae del borde
      if (enemy.y >= config.height) {
        enemy.destroy()
        return
      }

      // Verificar si el Goomba está tocando el suelo
      if (enemy.body.touching.down) {
        // Mantener la velocidad horizontal constante
        if (Math.abs(enemy.body.velocity.x) < enemy.speed) {
          enemy.setVelocityX(enemy.direction * enemy.speed)
        }
      }

      // Destruir Goombas que salen de los límites izquierdos del mundo
      if (enemy.x < -50) {
        enemy.destroy()
      }
    }
  })

  // Destruir bolas de fuego que salen de los límites del mundo
  fireBalls.children.entries.forEach(fireBall => {
    if (fireBall.x < 0 || fireBall.x > 4000 || fireBall.y > config.height) {
      fireBall.destroy()
    }
  })
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
