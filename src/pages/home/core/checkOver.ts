import { lineByFourDirection, isFull } from './common'
import templateBuilder from '@babel/template'

interface IsOverParam {
  table: Go.table
  firstColor: Go.Color
  lastX: number
  lastY: number
}
interface isOverResult {
  isOver: boolean
  winColor: null | Go.Color
  isFull: boolean
  // winCellList: null | [Go.Cell, Go.Cell, Go.Cell, Go.Cell, Go.Cell]
}

export function isOver(config: IsOverParam): isOverResult {
  const fourLine = lineByFourDirection(config.table, config.lastX, config.lastY)
  const fourLineToString = fourLine.map(line =>
    line.map(cell => (cell.isEmpty ? '_' : cell.color === 'white' ? 'W' : 'B')).join('')
  )
  if (isFull(config.table)) return { isOver: true, winColor: null, isFull: true }
  if (fourLineToString.find(str => str.match(/WWWWW/))) {
    return { isOver: true, winColor: 'white', isFull: false }
  } else if (fourLineToString.find(str => str.match(/BBBBB/))) {
    return { isOver: true, winColor: 'black', isFull: false }
  } else {
    return { isOver: false, winColor: null, isFull: false }
  }
}
