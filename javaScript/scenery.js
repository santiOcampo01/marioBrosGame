export const createScenery = (x, y, key, group) => {
  group.create(x, y, `${key}`).setOrigin(0, 0.5).refreshBody()

  return group
}

export const staticsBlocks = (x, y, key, group, contains = null) => {
  if (key === 'misteryBlock') {
    if (!contains) {
        group.create(x, y, `${key}`).anims.play('misteryBlockIdle', true).setOrigin(0.5, 0.5)
    } else {
      let block = group.create(x, y, `${key}`).anims.play('misteryBlockIdle', true).setOrigin(0.5, 0.5)
      block.contains = contains // asignamos el contenido del bloque misterioso
    }
  } else {
    group.create(x, y, `${key}`).setOrigin(0.5, 0.5)
  }
  return group
}
