export function lineByFourDirection(table: Go.table, x: number, y: number) {
  const numberList = [...Array(9)].map((i, j) => j - 4)
  const offset = [
    numberList.map(i => [i, 0]),
    numberList.map(i => [i, i]),
    numberList.map(i => [i, -i]),
    numberList.map(i => [0, i])
  ]
  return offset.map(line => line.map(([i, j]) => getCell(table, x + i, y + j)))
}

export function getCell(table: Go.table, x: number, y: number): Go.Cell {
  if (table[x] && table[x][y]) {
    return table[x][y]
  } else {
    return { x, y, isEmpty: true }
  }
}

export function getCenterPosition(table: Go.table): { x: number; y: number } {
  const center = (table.length - 1) / 2
  return { x: center, y: center }
}

export const anotherColor = (color: Go.Color) => (color === 'white' ? 'black' : 'white')

export const isFull = (table: Go.table) => {
  for (let index = 0; index < table.length; index++) {
    const line = table[index]
    for (let i = 0; i < line.length; i++) {
      const element = line[i]
      if (element.isEmpty) return false
    }
  }
  return true
}
