import { Table, ColorType, Cell, Color, PlayerType } from './Table'

export class EasyAI {
  private valueConfig = [
    { size: /OO/, value: 1 },
    { size: /_OOO_/, value: 100 },
    { size: /_OO_O_/, value: 100 },
    { size: /_O_OO_/, value: 100 },
    { size: /__OOOX/, value: 5 },
    { size: /XOOO__/, value: 5 },
    { size: /_OO_OX/, value: 5 },
    { size: /XO_OO_/, value: 5 },
    { size: /_O_OOX/, value: 5 },
    { size: /XOO_O_/, value: 5 },
    { size: /_OOOO_/, value: 1000 },
    { size: /_OOOOX/, value: 100 },
    { size: /XOOOO_/, value: 100 },
    { size: /XOOO_O/, value: 100 },
    { size: /O_OOOX/, value: 100 },
    { size: /OO_OO/, value: 100 },
    { size: /OOOOO/, value: 10000 }
  ]
  type: PlayerType = 'AI'
  table: Table
  color: ColorType
  constructor(table: Table, color: ColorType) {
    this.table = table
    this.color = color
  }
  computeForSelf() {
    return this.computeForColor(this.color)
  }
  computeForColor(color: ColorType) {
    const positionList = EasyAI.getImportantCellList(this.table).map(position => ({
      valueForSelf: this.countValue(position.x, position.y, color) * 1.1,
      valueForEnemy: this.countValue(position.x, position.y, Color.anotherColor(color)),
      x: position.x,
      y: position.y
    }))
    positionList.sort((a, b) =>
      a.valueForSelf + a.valueForEnemy + Math.random() - 0.5 > b.valueForSelf + b.valueForEnemy
        ? -1
        : 1
    )
    return positionList.map((i, j) => ({ ...i, order: j }))
  }
  static positionOrder = [[1, 0], [1, 1], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1]]
  protected static getImportantCellList(table: Table, maxDistance: number = 3) {
    const result: Cell[] = []
    const offsetList = [[0, 0]]
    ;[...Array(maxDistance)].forEach((i, j) =>
      EasyAI.positionOrder.forEach(([offsetX, offsetY]) =>
        offsetList.push([offsetX * (j + 1), offsetY * (j + 1)])
      )
    )
    const loopList = [...Array(table.size)]
    loopList.forEach((line, lineIndex) => {
      loopList.forEach((cell, cellIndex) => {
        if (
          table.getCell(lineIndex, cellIndex).isEmpty &&
          offsetList.find(
            ([offsetX, offsetY]) =>
              table.isInTable(lineIndex + offsetX, cellIndex + offsetY) &&
              !table.getCell(lineIndex + offsetX, cellIndex + offsetY).isEmpty
          )
        ) {
          result.push(table.getCell(lineIndex, cellIndex))
        }
      })
    })
    return result.length ? result : [table.getCenterPosition()]
  }
  countValue(x: number, y: number, color = this.table.getNextColor()) {
    if (!this.table.isInTable(x, y)) throw Error('not in table when count value')
    const fourLine = this.table.lineByFourDirection(x, y)
    const fourLineToString = fourLine.map((line, lineIndex) =>
      line
        .map((cell, cellIndex) => {
          if (!cell) return 'X'
          if (cell.isEmpty && cell.x === x && cell.y === y) return 'O'
          if (cell.isEmpty) return '_'
          return cell.color === color ? 'O' : 'X'
        })
        .join('')
    )
    const value = this.valueConfig.reduce((v, curRule) => {
      fourLineToString.forEach(str => {
        if (str.match(curRule.size)) v += curRule.value
      })
      return v
    }, 0)
    return value
  }
}
