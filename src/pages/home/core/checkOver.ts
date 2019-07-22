interface IsOverParam {
  table: Go.table
  firstColor: Go.Color
}
interface isOverResult {
  isOver: boolean
  winColor: null | Go.Color
  winCellList: null | [Go.Cell, Go.Cell, Go.Cell, Go.Cell, Go.Cell]
}

function isOver(config: IsOverParam): isOverResult {
  return {
    isOver: false,
    winColor: null,
    winCellList: null
  }
}

export default {}
