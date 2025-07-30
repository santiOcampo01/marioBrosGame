export const createScenery = (x, y, key, group) => {

    group
        .create(x, y, `${key}`)
        .setOrigin(0, 0.5)
        .refreshBody() 
        
    return group 
}
