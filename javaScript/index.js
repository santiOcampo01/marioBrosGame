const config = {
    type: Phaser.CANVAS,
    width: 256,
    height: 244,
    backgroundColor: 'white',
    parent: 'gameCanvas',
    scene: {
        preload, 
        create,
        update
    }
}

function preload() {
console.log('preload')
}

function create() {
console.log('create')
}

function update() {
console.log('update')
}