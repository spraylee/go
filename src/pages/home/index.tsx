import React, { useState } from 'react'
import Stage from './stage'

interface Props {
  title: string
}

const defaultConfig = {
  size: 19
}

const App: React.FC<Props> = props => {
  const tableEmpty: Go.table = [...Array(defaultConfig.size)].map((a, i) =>
    [...Array(defaultConfig.size)].map((b, j) => null as Go.Cell)
  )

  const [gameConfig, setGameConfig] = useState({
    size: defaultConfig.size,
    firstColor: 'white' as Go.Color,
    firstPlayer: 'user' as Go.PlayerType,
    secondPlayer: 'user' as Go.PlayerType
  })

  const [table, setTable] = useState(tableEmpty)
  const [gameState, setGameState] = useState({ cellCount: 0 })

  const run = () => {}

  const nextRoundPlayer = () =>
    gameState.cellCount % 2 === 0 ? gameConfig.firstPlayer : gameConfig.secondPlayer
  const isUserNextRound = () => nextRoundPlayer() === 'user'
  const anotherColor = (color: Go.Color) => (color === 'white' ? 'black' : 'white')
  const nextRoundColor = () =>
    gameState.cellCount % 2 === 0 ? gameConfig.firstColor : anotherColor(gameConfig.firstColor)
  const onUserSelect = (x: number, y: number) => {
    if (isUserNextRound() && !table[x][y]) {
      setCell(x, y, nextRoundColor())
    } else {
      throw new Error('not allowed action')
    }
  }
  const setCell = (x: number, y: number, color: Go.Color) => {
    table[x][y] = { x, y, color }
    setTable([...table])
    gameState.cellCount += 1
  }

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
