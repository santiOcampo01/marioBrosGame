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
}
