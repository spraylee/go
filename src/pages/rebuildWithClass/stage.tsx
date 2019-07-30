import React from 'react'
import './stage.less'
import { ColorType } from './Table'

interface Props {
  table: (ColorType | null)[][]
  isUserRound: boolean
  nextColor: ColorType
  isActive: boolean
  userRoundTips: { x: number; y: number; order: number; valueForEnemy: number }[]
  onUserSelect: (x: number, y: number) => void
}

export default (props => {
  const clickCell = (x: number, y: number, color: null | ColorType) => {
    if (!color && props.isUserRound && props.isActive) {
      props.onUserSelect(x, y)
    }
  }
  const getTips = (i: number, j: number, color: null | ColorType) => {
    if (!color && props.userRoundTips.length) {
      const match = props.userRoundTips.find(item => item.x === i && item.y === j)
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
              {/* {line.map((cell, j) => {
                const className = `cell col-center ${j === 0 ? 'first' : ''} ${
                  j === props.table.length - 1 ? 'last' : ''
                }`
                return (
                  <Cell
                    className={className}
                    tips={getTips(cell)}
                    cell={cell}
                    key={j}
                    onClick={() => clickCell(i, j, cell)}
                  />
                )
              })} */}
              {line.map((color, j) => (
                <div
                  className={`cell col-center ${j === 0 ? 'first' : ''} ${
                    j === props.table.length - 1 ? 'last' : ''
                  }`}
                  key={j}
                >
                  <div
                    className={`cell-inner ${color} ${!color ? 'empty' : ''}`}
                    onClick={e => clickCell(i, j, color)}
                  >
                    {getTips(i, j, color)}
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

type CellProps = {
  cell: Go.Cell
  onClick: () => void
  tips: false | JSX.Element | undefined
  className: string
}
const Cell: React.FC<CellProps> = (props: CellProps) => {
  return (
    <div className={props.className}>
      <div
        className={`cell-inner ${props.cell && props.cell.color} ${!props.cell ? 'empty' : ''}`}
        onClick={props.onClick}
      >
        {props.tips}
      </div>
    </div>
  )
}
