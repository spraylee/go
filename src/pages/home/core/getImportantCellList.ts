import { getCell, getCenterPosition } from './common'

interface Position {
  x: number
  y: number
}

const maxDistance = 4
const order = [[1, 0], [1, 1], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1]]

export function getImportantCellList(table: Go.table): Position[] {
  const result: Position[] = []
  const offsetList = [[0, 0]]
  ;[...Array(maxDistance)].forEach((i, j) =>
    order.forEach(([offsetX, offsetY]) => offsetList.push([offsetX * (j + 1), offsetY * (j + 1)]))
  )
  table.forEach((line, lineIndex) => {
    line.forEach((cell, cellIndex) => {
      if (
        getCell(table, lineIndex, cellIndex).isEmpty &&
        offsetList.find(
          ([offsetX, offsetY]) => !getCell(table, lineIndex + offsetX, cellIndex + offsetY).isEmpty
        )
      ) {
        result.push({ x: lineIndex, y: cellIndex })
      }
    })
  })
  return result.length ? result : [getCenterPosition(table)]
}
