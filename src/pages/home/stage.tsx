import React from 'react'

import './stage.less'
interface Props {
  table: Go.Cell[][]
  isUserRound: boolean
  onUserSelect: (x: number, y: number) => void
}

export default (props => {
  const clickCell = (x: number, y: number, cell: any) => {
    if (!cell && props.isUserRound) {
      props.onUserSelect(x, y)
    }
  }
  return (
    <div className="go-stage col">
      {!props.table ? null : (
        <div className="content col">
          {props.table.map((line, i) => (
            <div
              className={`line row-center ${i === 0 ? 'first' : ''} ${i === props.table.length - 1 ? 'last' : ''}`}
              key={i}
            >
              {line.map((cell, j) => (
                <div
                  className={`cell col-center ${j === 0 ? 'first' : ''} ${j === props.table.length - 1 ? 'last' : ''}`}
                  key={j}
                >
                  <div className="cell-inner" onClick={e => clickCell(i, j, cell)}>
                    {cell && cell.color}
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
