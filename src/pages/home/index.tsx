import React, { useState, useEffect } from 'react'
import Stage from './stage'
import { isOver } from './core/checkOver'
import { move } from './core/ai'
import store from './store'
import { observer } from 'mobx-react'
import { sleep } from './core/common'
interface Props {
  title: string
  store: any
}

const defaultConfig = {
  size: 19
}
let lastPosition: null | { x: number; y: number } = { x: 0, y: 0 }
let lastMoveTime: null | number = null

const App: React.FC<Props> = observer(props => {
  // const tableEmpty: Go.table = [...Array(defaultConfig.size)].map((a, i) =>
  //   [...Array(defaultConfig.size)].map((b, j) => ({ x: i, y: j, isEmpty: true } as Go.Cell))
  // )
  // const [gameConfig, setGameConfig] = useState({
  //   size: defaultConfig.size,
  //   firstColor: 'white' as Go.Color,
  //   firstPlayer: 'ai' as Go.PlayerType,
  //   secondPlayer: 'ai' as Go.PlayerType
  // })

  // const [table, setTable] = useState(tableEmpty)
  // const [gameState, setGameState] = useState({ cellCount: 0 })

  const { table, setTable, gameConfig, setGameConfig, gameState, setGameState } = props.store

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
      store.logs.push(`AI: ${Date.now() - start}ms`)
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
  const setCell = async (x: number, y: number, color: Go.Color) => {
    if (lastMoveTime) {
      store.logs.push('From last move: ' + (Date.now() - lastMoveTime))
      console.log('From last move: ' + (Date.now() - lastMoveTime))
    }
    lastMoveTime = Date.now()
    table[x][y] = { x, y, color }
    lastPosition = { x, y }
    // setTable([...table])
    // setGameState({ ...gameState, cellCount: gameState.cellCount + 1 })
    gameState.cellCount += 1
    // await sleep(100)
    lastPosition && check(lastPosition.x, lastPosition.y)
  }

  // lastPosition && check(lastPosition.x, lastPosition.y)

  useEffect(() => {
    // setTimeout(() => {
    lastPosition && check(lastPosition.x, lastPosition.y)
    // }, 10)
  }, [])

  const tips = {
    class: nextRoundColor() === gameConfig.firstColor ? 'left' : 'right',
    text: `${nextRoundPlayer() === 'user' ? '玩家' : '电脑'}(${
      nextRoundColor() === 'black' ? '黑' : '白'
    }方)回合`
  }

  const clickCount = () => {
    console.log(gameState)
    setGameState()
    console.log(gameState)
  }

  return (
    <div className="main col-center">
      <div className="stage col">
        <span onClick={() => clickCount()}>count: {gameState.cellCount}</span>
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
      <div className="log-list col">
        {store.logs.map(i => (
          <span>{i}</span>
        ))}
      </div>
    </div>
  )
})

export default App
