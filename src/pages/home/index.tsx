import React, { useState, useEffect } from 'react'
import Stage from './stage'
import { isOver } from './core/checkOver'
import { move } from './core/ai'
interface Props {
  title: string
}

const defaultConfig = {
  size: 19
}
let lastPosition: null | { x: number; y: number } = { x: 0, y: 0 }
let lastMoveTime: null | number = null

const App: React.FC<Props> = props => {
  const tableEmpty: Go.table = [...Array(defaultConfig.size)].map((a, i) =>
    [...Array(defaultConfig.size)].map((b, j) => ({ x: i, y: j, isEmpty: true } as Go.Cell))
  )
  const [gameConfig, setGameConfig] = useState({
    size: defaultConfig.size,
    firstColor: 'white' as Go.Color,
    firstPlayer: 'ai' as Go.PlayerType,
    secondPlayer: 'ai' as Go.PlayerType
  })

  const [table, setTable] = useState(tableEmpty)
  const [gameState, setGameState] = useState({ cellCount: 0 })

  const check = (x: number, y: number) => {
    const result = isOver({
      table: table,
      lastX: x,
      lastY: y,
      firstColor: gameConfig.firstColor
    })
    if (result.isOver) {
      return alert('over')
    }
    if (!isUserNextRound()) {
      let start = Date.now()
      const position = move(table, nextRoundColor())
      console.log(`AI: ${Date.now() - start}ms`)
      console.log(position)
      setCell(position.x, position.y, nextRoundColor())
      // check(position.x, position.y)
    }
  }

  const nextRoundPlayer = () =>
    gameState.cellCount % 2 === 0 ? gameConfig.firstPlayer : gameConfig.secondPlayer
  const isUserNextRound = () => nextRoundPlayer() === 'user'
  const anotherColor = (color: Go.Color) => (color === 'white' ? 'black' : 'white')
  const nextRoundColor = () =>
    gameState.cellCount % 2 === 0 ? gameConfig.firstColor : anotherColor(gameConfig.firstColor)
  const onUserSelect = (x: number, y: number) => {
    if (isUserNextRound() && table[x][y].isEmpty) {
      setCell(x, y, nextRoundColor())
      // check(x, y)
    } else {
      throw new Error('not allowed action')
    }
  }
  const setCell = (x: number, y: number, color: Go.Color) => {
    if (lastMoveTime) {
      console.log('From last move: ' + (Date.now() - lastMoveTime))
    }
    lastMoveTime = Date.now()
    table[x][y] = { x, y, color }
    lastPosition = { x, y }
    setTable([...table])
    setGameState({ ...gameState, cellCount: gameState.cellCount + 1 })
  }
  useEffect(() => {
    // setTimeout(() => {
    lastPosition && check(lastPosition.x, lastPosition.y)
    // }, 10)
  }, [gameState])

  const tips = {
    class: nextRoundColor() === gameConfig.firstColor ? 'left' : 'right',
    text: `${nextRoundPlayer() === 'user' ? '玩家' : '电脑'}(${
      nextRoundColor() === 'black' ? '黑' : '白'
    }方)回合`
  }

  return (
    <div className="main col-center">
      <div className="stage col">
        <span>count: {gameState.cellCount}</span>
        <div className={`header ${tips.class}`}>
          <div className="tips">{tips.text}</div>
        </div>
        <Stage
          nextColor={nextRoundColor()}
          table={table}
          isUserRound={isUserNextRound()}
          onUserSelect={onUserSelect}
        />
      </div>
    </div>
  )
}

export default App
