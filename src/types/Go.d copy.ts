export const createEmptyTable = () =>
  [...Array(defaultConfig.size)].map((a, i) =>
    [...Array(defaultConfig.size)].map((b, j) => ({ x: i, y: j, isEmpty: true } as Go.Cell))
  )

declare namespace Go {
  export type Color = 'white' | 'black'
  export type PlayerType = 'user' | 'ai'
  export type Cell = { x: number; y: number; color?: Color; isEmpty?: boolean }
  export type table = Cell[][]
  export class Color {
    static anotherColor(color: Go.Color) {
      return color === 'white' ? 'black' : 'white'
    }
  }
  export class Table {
    private content = createEmptyTable()
    size: number
    lastMovement: null | { x: number; y: number } = null
    constructor(size: number) {
      this.size = size
    }
    getCell(x, y) {
      return this.content[x][y]
    }
    isOver() {
      // if ()
    }
    isFull() {
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          if (this.getCell(i, j).isEmpty) return false
        }
      }
      return true
    }
    getCenterPosition() {
      const center = (table.length - 1) / 2
      return this.getCell(center, center)
    }
  }
}
