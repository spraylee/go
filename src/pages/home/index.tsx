import React, { useState, useEffect } from 'react'
import Stage from './stage'
import { isOver } from './core/checkOver'
import { recommandMovement } from './core/ai'
import store, {
  createEmptyTable,
  getPureTable,
  setTableCell,
  restart,
  setUserRoundTips,
  selectGameMode,
  GameModeType
} from './store'
import { observer } from 'mobx-react'
import { sleep, untilRender } from './core/common'
import { Button, Switch, Select, Modal } from 'antd'

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
  // const table: Go.table = store.pureTable
  // const gameConfig = store.gameConfig
  // const gameState = store.gameState
  // const stateTable = store.table

  const check = async (x: number, y: number) => {
    const result = isOver({
      table: getPureTable(),
      lastX: x,
      lastY: y,
      firstColor: store.gameConfig.firstColor
    })
    if (result.isOver) {
      await untilRender()
      store.isActive = false
      return Modal.info({
        title: '游戏结束',
        centered: true,
        content: (
          <div>
            <p>{result.winColor === 'black' ? '黑棋' : '白棋'}获胜</p>
          </div>
        ),
        onOk() {}
      })
    }
    if (!isUserNextRound()) {
      setUserRoundTips([])
      let start = Date.now()
      const position = recommandMovement(getPureTable(), nextRoundColor())[0]
      console.log(`AI: ${Date.now() - start}ms`)
      store.logs.push(`AI: ${Date.now() - start}ms`)
      console.log(position)
      setCell(position.x, position.y, nextRoundColor())
    } else if (store.gameState.isShowRecommand) {
      getRecommand()
    }
  }

  const getRecommand = () => {
    if (isUserNextRound() && store.gameState.isShowRecommand) {
      const recommandList = recommandMovement(getPureTable(), nextRoundColor())
      setUserRoundTips(recommandList)
    } else {
      setUserRoundTips([])
    }
  }

  const nextRoundPlayer = () =>
    store.gameState.cellCount % 2 === 0
      ? store.gameConfig.firstPlayer
      : store.gameConfig.secondPlayer
  const isUserNextRound = () => nextRoundPlayer() === 'user'
  const anotherColor = (color: Go.Color) => (color === 'white' ? 'black' : 'white')
  const nextRoundColor = () =>
    store.gameState.cellCount % 2 === 0
      ? store.gameConfig.firstColor
      : anotherColor(store.gameConfig.firstColor)
  const onUserSelect = (x: number, y: number) => {
    if (isUserNextRound() && store.table[x][y].isEmpty) {
      setCell(x, y, nextRoundColor())
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
    setTableCell(x, y, color)
    lastPosition = { x, y }
    await untilRender()
    // await sleep(10)
    lastPosition && check(lastPosition.x, lastPosition.y)
  }

  const tips = {
    class: nextRoundColor() === store.gameConfig.firstColor ? 'left' : 'right',
    text: `${nextRoundPlayer() === 'user' ? '玩家' : '电脑'}(${
      nextRoundColor() === 'black' ? '黑' : '白'
    }方)回合`
  }

  const start = () => {
    // store.start()
    restart()
    // store.table = createEmptyTable()
    // store.pureTable = createEmptyTable()
    lastPosition && check(lastPosition.x, lastPosition.y)
  }

  return (
    <div className="main col-center">
      <div className="stage col">
        {/* <div className="row-center">
          <Button onClick={start}>开始</Button>
        </div> */}
        <div className="row">
          <div>
            <div className={`header ${tips.class}`}>
              <div className={`tips ${!store.isActive && 'opacity'}`}>{tips.text}</div>
            </div>
            <Stage
              isActive={store.isActive}
              nextColor={nextRoundColor()}
              table={store.table}
              isUserRound={isUserNextRound()}
              onUserSelect={onUserSelect}
              userRoundTips={store.userRoundTips}
            />
          </div>
          {/* <div className="log-list">
            {store.logs.map((i, j) => (
              <div key={j}>{i}</div>
            ))}
          </div> */}
          <div className="control">
            <div className="control-item">
              <span>关键提示</span>
              <Switch
                checked={store.gameState.isShowRecommand}
                onChange={v => {
                  store.gameState.isShowRecommand = v
                  getRecommand()
                }}
              />
            </div>
            <div className="control-item">
              <span>对弈模式 </span>
              <Select
                style={{ width: 120 }}
                value={store.gameConfig.mode}
                onChange={(v: GameModeType) => selectGameMode(v)}
              >
                {store.gameConfig.gameModeList.map(mode => (
                  <Select.Option title={mode.label} value={mode.value} key={mode.value}>
                    {mode.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="control-item row-center margin-top">
              <Button onClick={start}>开始</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default App
