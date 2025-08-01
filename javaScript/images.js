// objeto para inicializar las imagenes
const INIT_IMAGES = [
  { key: 'cloud1', path: 'assets/scenery/overworld/cloud1.png' },
  { key: 'cloud2', path: 'assets/scenery/overworld/cloud2.png' },
  { key: 'floorBricks', path: 'assets/scenery/overworld/floorbricks.png' },
  { key: 'staticBlock', path: 'assets/blocks/overworld/immovableBlock.png' },
  { key: 'superMushroom', path: 'assets/collectibles/super-mushroom.png' },
  { key: 'bush1', path: 'assets/scenery/overworld/bush1.png' },
  { key: 'bush2', path: 'assets/scenery/overworld/bush2.png' },
  { key: 'mountain1', path: 'assets/scenery/overworld/mountain1.png' },
  { key: 'mountain2', path: 'assets/scenery/overworld/mountain2.png' },
  { key: 'emptyBlock', path: 'assets/blocks/overworld/emptyBlock.png' },
  { key: 'brickBlock', path: 'assets/blocks/overworld/block.png' },
  { key: 'smallTube', path: 'assets/scenery/vertical-small-tube.png' },
  { key: 'mediumTube', path: 'assets/scenery/vertical-medium-tube.png' },
  { key: 'largeTube', path: 'assets/scenery/vertical-large-tube.png.png' },
  { key: 'flagMast', path: 'assets/scenery/flag-mast.png' },
  { key: 'flag', path: 'assets/scenery/final-flag.png' },
]

// funcion para cargar las imagenes recorriendo el objeto INIT_IMAGES donde esta su key y path
export const loadImages = scene => {
  INIT_IMAGES.forEach(({ key, path }) => {
    scene.load.image(key, path) // cargamos la imagen con su key y path
  })
}
