import React from 'react'

import './stage.less'
interface Props {
  table: Go.Cell[][]
  isUserRound: boolean
  nextColor: Go.Color
  isActive: boolean
  userRoundTips: { x: number; y: number; order: number; valueForEnemy: number }[]
  onUserSelect: (x: number, y: number) => void
}

export default (props => {
  const clickCell = (x: number, y: number, cell: Go.Cell) => {
    if (cell.isEmpty && props.isUserRound && props.isActive) {
      props.onUserSelect(x, y)
    }
  }
  const getTips = (cell: Go.Cell) => {
    if (cell.isEmpty && props.userRoundTips.length) {
      const match = props.userRoundTips.find(item => item.x === cell.x && item.y === cell.y)
      // const size = 80 / ((match || { order: 0 }).order + 1) ** 0.6
      const size = 30
      const isImporant = !!match && match.valueForEnemy > 200
      return (
        match &&
        isImporant && (
          <span
            className={`recommand ${isImporant && 'important'}`}
            style={{ width: `${size}%`, height: `${size}%` }}
            title={`danger: ${match.valueForEnemy}`}
          >
            {/* {isImporant && match.valueForEnemy} */}
          </span>
        )
      )
    }
  }
  return (
    <div className="go-stage col">
      {!props.table ? null : (
        <div className={`content col next-${props.nextColor}`}>
          {props.table.map((line, i) => (
            <div
              className={`line row-center ${i === 0 ? 'first' : ''} ${
                i === props.table.length - 1 ? 'last' : ''
              }`}
              key={i}
            >
              {line.map((cell, j) => (
                <div
                  className={`cell col-center ${j === 0 ? 'first' : ''} ${
                    j === props.table.length - 1 ? 'last' : ''
                  }`}
                  key={j}
                >
                  <div
                    className={`cell-inner ${cell && cell.color} ${!cell ? 'empty' : ''}`}
                    onClick={e => clickCell(i, j, cell)}
                  >
                    {getTips(cell)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}) as React.FC<Props>
