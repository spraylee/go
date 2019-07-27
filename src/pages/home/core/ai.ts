import { countValue } from './countValue'
import { getImportantCellList } from './getImportantCellList'
import { anotherColor } from './common'

export function recommandMovement(
  table: Go.table,
  color: Go.Color
): { x: number; y: number; order: number; valueForEnemy: number; valueForSelf: number }[] {
  const positionList = getImportantCellList(table).map(position => ({
    valueForSelf: countValue(table, position.x, position.y, color) * 1.1,
    valueForEnemy: countValue(table, position.x, position.y, anotherColor(color)),
    // valueForEnemy: 0,
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
