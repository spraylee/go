import { Button, Modal, Select, Switch } from 'antd'
import { observer } from 'mobx-react'
import React from 'react'
import { recommandMovement } from './core/ai'
import store, { createEmptyTable, GameModeType } from './store'
import { sleep, untilRender } from './core/common'
import Stage from './stage'
import { isOver } from './core/checkOver'

interface Props {
  title: string
  store: any
}

const defaultConfig = {
  size: 19
}
let lastPosition: null | { x: number; y: number } = { x: 0, y: 0 }
let lastMoveTime: null | number = null

const App: React.FC<Props> = observer((props: Props) => {
  // const table: Go.table = store.pureTable
  // const gameConfig = store.gameConfig
  // const gameState = store.gameState
  // const stateTable = store.table

  const check = async (x: number, y: number) => {
    const result = isOver({
      table: store.pureTable,
      lastX: x,
      lastY: y,
      firstColor: store.gameConfig.firstColor
    })
    if (result.isOver) {
      await untilRender()
      store.disableTable()
      let overMessage = ''
      if (store.gameConfig.mode === 'AI' && !isUserNextRound()) {
        overMessage = store.gameState.isShowRecommand ? '你侥幸击败了简单电脑' : '你击败了简单电脑'
      } else if (store.gameConfig.mode === 'AI' && isUserNextRound()) {
        overMessage = '你居然输给了简单电脑，菜鸡...'
      } else if (result.winColor) {
        overMessage = `${result.winColor === 'black' ? '黑棋' : '白棋'}获胜`
      } else {
        overMessage = `棋盘都占满了，未分出胜负`
      }
      return Modal.info({
        title: '游戏结束',
        centered: true,
        content: (
          <div>
            <p>{overMessage}</p>
          </div>
        ),
        onOk() {}
      })
    }
    if (!isUserNextRound()) {
      store.setUserRoundTips([])
      if (store.gameConfig.mode === 'AI') {
        await sleep(200)
      }
      await untilRender()
      let start = Date.now()
      const position = recommandMovement(store.pureTable, nextRoundColor())[0]
      console.log(`AI: ${Date.now() - start}ms`)
      store.pushLog(`AI: ${Date.now() - start}ms`)
      console.log(position)
      setCell(position.x, position.y, nextRoundColor())
    } else if (store.gameState.isShowRecommand) {
      getRecommand()
    }
  }

  const getRecommand = () => {
    if (isUserNextRound() && store.gameState.isShowRecommand && store.gameConfig.mode !== 'AI|AI') {
      const recommandList = recommandMovement(store.pureTable, nextRoundColor())
      store.setUserRoundTips(recommandList)
    } else {
      store.setUserRoundTips([])
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
      store.pushLog('From last move: ' + (Date.now() - lastMoveTime))
      console.log('From last move: ' + (Date.now() - lastMoveTime))
    }
    lastMoveTime = Date.now()
    store.setTableCell(x, y, color)
    lastPosition = { x, y }
    lastPosition && check(lastPosition.x, lastPosition.y)
  }

  const tips = {
    class: nextRoundColor() === store.gameConfig.firstColor ? 'left' : 'right',
    text: `${nextRoundPlayer() === 'user' ? '玩家' : '电脑'}(${
      nextRoundColor() === 'black' ? '黑' : '白'
    }棋)回合`
  }

  const start = () => {
    // store.start()
    store.restart()
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
              <div
                className={`tips ${(!store.isActive || store.gameConfig.mode === 'AI|AI') &&
                  'opacity'}`}
              >
                {tips.text}
              </div>
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
              <span>危险提示</span>
              <Switch
                disabled={store.gameConfig.mode === 'AI|AI'}
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
                onChange={(v: GameModeType) => store.selectGameMode(v)}
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
