import { EasyAI } from './AiPlayer'

export type ColorType = 'white' | 'black'

export class Color {
  static anotherColor(color: ColorType) {
    return color === 'white' ? 'black' : 'white'
  }
}

export class Cell {
  x: number
  y: number
  color: ColorType | null
  isEmpty: Boolean
  constructor(x: number, y: number, color: ColorType | null = null) {
    this.x = x
    this.y = y
    this.color = color
    this.isEmpty = this.color === null
  }
  set(color: ColorType) {
    if (!this.isEmpty)
      throw Error(`cannot set cell color, cell is not empty: ${this.x} ${this.y} ${this.color}`)
    this.color = color
    this.isEmpty = false
  }
  cancel() {
    if (this.isEmpty) throw Error(`cannot cancel a empty cell: ${this.x} ${this.y}`)
    this.isEmpty = true
    this.color = null
  }
}

export type PlayerType = 'AI' | 'USER'
export class UserPlayer {
  name: string
  type: PlayerType = 'USER'
  color: ColorType
  constructor(color: ColorType, name = '') {
    this.name = name
    this.color = color
  }
}

type Player = EasyAI | UserPlayer
export class Table {
  private content: Cell[][]
  firstColor: ColorType
  size: number
  history: Cell[] = []
  isFull: boolean = false
  isOver: boolean = false
  winColor: ColorType | null = null
  firstPlayer: Player | null = null
  secondPlyer: Player | null = null
  constructor(size: number, firstColor: ColorType = 'white') {
    this.size = size
    this.firstColor = firstColor
    this.content = Table.createEmtpyTableContent(size)
  }
  setPlayer(first: EasyAI | UserPlayer | null, second: EasyAI | UserPlayer | null) {
    this.firstPlayer = first
    this.secondPlyer = second
  }
  getNextColor() {
    const last = this.getLastMove()
    return last && last.color ? Color.anotherColor(last.color) : this.firstColor
  }
  getNextPlayer(): Player {
    if (!this.firstPlayer || !this.secondPlyer) throw Error('player is not set')
    return this.getNextColor() === this.firstColor ? this.firstPlayer : this.secondPlyer
  }
  setCell(x: number, y: number) {
    if (!this.isInTable(x, y)) throw Error(`x:${x} y:${y} is not a table`)
    if (!this.getCell(x, y).isEmpty) throw Error(`cannot set cell, cell is not empty: ${x} ${y}`)
    this.getCell(x, y).set(this.getNextColor())
    this.history.push(this.getCell(x, y))
    this.computeState()
  }
  back(step: number) {
    if (this.history.length < step) throw Error(`cannot back for step: ${step}`)
    ;[...Array(step)].forEach(() => {
      const last = this.history.pop() as Cell
      last.cancel()
    })
    this.computeState()
  }
  computeState() {
    this.isFull = this.checkIsFull()
    this.checkIsOver()
  }
  getLastMove() {
    return this.history[this.history.length - 1]
  }
  isInTable(x: number, y: number) {
    return x >= 0 && x < this.size && y >= 0 && y < this.size
  }
  getCell(x: number, y: number) {
    if (!this.isInTable(x, y)) throw Error(`x:${x} y:${y} is not a table`)
    return this.content[x][y]
  }
  checkIsOver() {
    const fourLine = this.lineByFourDirectionAboutLastMove()
    const fourLineToString = fourLine.map(line =>
      line
        .map(cell => (!cell ? 'X' : cell.isEmpty ? '_' : cell.color === 'white' ? 'W' : 'B'))
        .join('')
    )
    if (fourLineToString.find(str => str.match(/WWWWW/))) {
      this.isOver = true
      this.winColor = 'white'
    } else if (fourLineToString.find(str => str.match(/BBBBB/))) {
      this.isOver = true
      this.winColor = 'black'
    } else {
      this.isOver = false
      this.winColor = null
    }
  }
  checkIsFull() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.getCell(i, j).isEmpty) return false
      }
    }
    return true
  }
  getCenterPosition() {
    const center = (this.size - 1) / 2
    return this.getCell(center, center)
  }
  reset() {
    this.content = Table.createEmtpyTableContent(this.size)
    this.computeState()
  }
  getCellTableForRender() {
    return this.content.map(i => i.map(j => j.color))
  }
  private static createEmtpyTableContent(size: number) {
    return [...Array(size)].map((a, i) => [...Array(size)].map((b, j) => new Cell(i, j)))
  }
  lineByFourDirection(x: number, y: number) {
    const numberList = [...Array(9)].map((i, j) => j - 4)
    const offset = [
      numberList.map(i => [i, 0]),
      numberList.map(i => [i, i]),
      numberList.map(i => [i, -i]),
      numberList.map(i => [0, i])
    ]
    return offset.map(line =>
      line.map(([i, j]) => (!this.isInTable(x + i, y + j) ? null : this.getCell(x + i, y + j)))
    )
  }
  lineByFourDirectionAboutLastMove() {
    const last = this.getLastMove()
    if (!last) throw 'table is new'
    return this.lineByFourDirection(last.x, last.y)
  }
}

// export function lineByFourDirectionAboutLastMove(table: Go.table, x: number, y: number) {
//   const numberList = [...Array(9)].map((i, j) => j - 4)
//   const offset = [
//     numberList.map(i => [i, 0]),
//     numberList.map(i => [i, i]),
//     numberList.map(i => [i, -i]),
//     numberList.map(i => [0, i])
//   ]
//   return offset.map(line => line.map(([i, j]) => getCell(table, x + i, y + j)))
// }
