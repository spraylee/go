import { lineByFourDirection } from './common'

interface IsOverParam {
  table: Go.table
  firstColor: Go.Color
  lastX: number
  lastY: number
}
interface isOverResult {
  isOver: boolean
  winColor: null | Go.Color
  // winCellList: null | [Go.Cell, Go.Cell, Go.Cell, Go.Cell, Go.Cell]
}

export function isOver(config: IsOverParam): isOverResult {
  const fourLine = lineByFourDirection(config.table, config.lastX, config.lastY)
  const fourLineToString = fourLine.map(line =>
    line.map(cell => (cell.isEmpty ? '_' : cell.color === 'white' ? 'W' : 'B')).join('')
  )
  if (fourLineToString.find(str => str.match(/WWWWW/))) {
    return { isOver: true, winColor: 'white' }
  } else if (fourLineToString.find(str => str.match(/BBBBB/))) {
    return { isOver: true, winColor: 'black' }
  } else {
    return { isOver: false, winColor: null }
  }
}
