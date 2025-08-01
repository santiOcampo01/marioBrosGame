export const createScenery = (x, y, key, group) => {

    group
        .create(x, y, `${key}`)
        .setOrigin(0, 0.5)
        .refreshBody() 
        
    return group 
}

export const staticsBlocks = (x, y, key, group) => {
    if(key === 'misteryBlock') {
        group.create(x, y, `${key}`).anims.play('misteryBlockIdle', true).setOrigin(0.5, 0.5)
    } else {
        group.create(x, y, `${key}`).setOrigin(0.5, 0.5)
    }

        return group 
}

