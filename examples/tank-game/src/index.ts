import { Image } from '@svgdotjs/svg.js'
import { createHex, createHexPrototype, Grid, hexToPoint, inStore, rays, toString } from 'honeycomb-grid'
import { renderPlayer, renderTile } from './render'
import { TILES } from './tiles'
import { GameState, Tile } from './types'

/**
 * todo:
 * - add a way to "get" a hex relative to another hex, e.g.: 3 hexes North of a hex (use this in ring() and rays())
 */

const config = {
  viewDistanceInTiles: 3,
}

const gameState: GameState = {
  playerCoordinates: [0, 7],
}

const hexPrototype = createHexPrototype<Tile>({ dimensions: 50, origin: 'topLeft' })
const tiles = new Map(TILES.map((tile) => [toString(tile), createHex(hexPrototype, tile)]))

// todo: stateful grids should only traverse hexes in store by default?
new Grid(hexPrototype, tiles)
  .traverse(
    rays({
      start: gameState.playerCoordinates,
      length: config.viewDistanceInTiles,
      updateRay: (ray) => {
        // todo: make this a helper in Honeycomb?
        return ray.reduce(
          (state, tile) => {
            if (!state.opaque && tile.terrain) {
              state.tiles.push(tile)
              state.opaque = tile.terrain.opaque
            }
            return state
          },
          { opaque: false, tiles: [] },
        ).tiles
      },
    }),
  )
  // .traverse(spiral({ start: gameState.playerCoordinates, radius: config.fieldOfViewRadius }))
  .filter(inStore)
  .map((tile) => {
    // console.log(tile)
    tile.element = renderTile(tile)
  })
  .run()

const playerElement = renderPlayer(hexPrototype.width, hexPrototype.height)

movePlayer(playerElement, gameState)

function movePlayer(element: Image, { playerCoordinates }: GameState) {
  const { x, y } = hexToPoint(createHex(hexPrototype, playerCoordinates))
  element.center(x, y)
}
