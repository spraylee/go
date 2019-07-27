import { lineByFourDirection } from './common'

const rules = [
  { size: /OO/, value: 1, notReverse: false },
  { size: /_OOO_/, value: 100, notReverse: false },
  { size: /_OO_O_/, value: 100 },
  { size: /_O_OO_/, value: 100 },
  { size: /__OOOX/, value: 5 },
  { size: /XOOO__/, value: 5 },
  { size: /_OO_OX/, value: 5 },
  { size: /XO_OO_/, value: 5 },
  { size: /_O_OOX/, value: 5 },
  { size: /XOO_O_/, value: 5 },
  { size: /_OOOO_/, value: 1000, notReverse: false },
  { size: /_OOOOX/, value: 100 },
  { size: /XOOOO_/, value: 100 },
  { size: /XOOO_O/, value: 100 },
  { size: /O_OOOX/, value: 100 },
  { size: /OO_OO/, value: 100, notReverse: false },
  { size: /OOOOO/, value: 10000, notReverse: false }
]

export function countValue(table: Go.table, x: number, y: number, color: Go.Color): number {
  const fourLine = lineByFourDirection(table, x, y)
  const fourLineToString = fourLine.map((line, lineIndex) =>
    line
      .map((cell, cellIndex) => {
        if (cell.isEmpty && cell.x === x && cell.y === y) {
          return 'O'
        } else {
          return cell.isEmpty ? '_' : cell.color === color ? 'O' : 'X'
        }
      })
      .join('')
  )
  const fourLineToStringReverse = fourLineToString.map(i =>
    i
      .split('')
      .reverse()
      .join('')
  )
  const value = rules.reduce((v, curRule) => {
    // const target = curRule.notReverse
    //   ? fourLineToString
    //   : [...fourLineToString, ...fourLineToStringReverse]
    const target = fourLineToString

    target.forEach(str => {
      if (str.match(curRule.size)) {
        v += curRule.value
      }
    })
    return v
  }, 0)
  return value
}
