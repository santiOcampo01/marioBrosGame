// objeto para inicializar las imagenes
const INIT_IMAGES = [
    { key: 'cloud1', path: 'assets/scenery/overworld/cloud1.png' },
    { key: 'floorBricks', path: 'assets/scenery/overworld/floorbricks.png' },
    { key: 'superMushroom', path: 'assets/collectibles/super-mushroom.png' },
]

// funcion para cargar las imagenes recorriendo el objeto INIT_IMAGES donde esta su key y path
export const loadImages = (scene) => {
    INIT_IMAGES.forEach(({ key, path }) => {
        scene.load.image(key, path) // cargamos la imagen con su key y path
    })
}