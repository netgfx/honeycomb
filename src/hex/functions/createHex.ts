import { isOffset } from '../../utils'
import { Hex, HexCoordinates } from '../types'
import { isHex } from './isHex'
import { offsetToCube } from './offsetToCube'

export const createHex = <T extends Hex>(prototypeOrHex: T, props: Partial<T> | HexCoordinates = { q: 0, r: 0 }): T => {
  if (isHex(prototypeOrHex)) {
    return prototypeOrHex.clone(props)
  }

  if (isOffset(props)) {
    const { col, row, ...otherProps } = props
    const coordinates = offsetToCube({ col, row }, prototypeOrHex)
    return Object.assign(Object.create(prototypeOrHex), coordinates, otherProps)
  }

  return Object.assign(Object.create(prototypeOrHex), props)
}
