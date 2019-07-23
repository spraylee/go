import { countValue } from './countValue'
import { getImportantCellList } from './getImportantCellList'
import { anotherColor } from './common'

export function move(table: Go.table, color: Go.Color): { x: number; y: number } {
  console.log('start move')
  const positionList = getImportantCellList(table).map(position => ({
    valueForSelf: countValue(table, position.x, position.y, color) * 1.1,
    valueForEnemy: countValue(table, position.x, position.y, anotherColor(color)),
    // valueForEnemy: 0,
    x: position.x,
    y: position.y
  }))
  positionList.sort((a, b) =>
    a.valueForSelf + a.valueForEnemy > b.valueForSelf + b.valueForEnemy ? -1 : 1
  )
  console.log(positionList)
  return positionList[0]
}
