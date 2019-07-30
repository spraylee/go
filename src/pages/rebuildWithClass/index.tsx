import React from 'react'
import store from './store'
import { Switch, Select, Button } from 'antd'
import Stage from './stage'
import { observer } from 'mobx-react'

const Game: React.FC = observer(props => {
  const tips = {
    class: store.table.getNextColor() === store.table.firstColor ? 'left' : 'right',
    text: `${store.gameState.isUserRound ? '玩家' : '电脑'}(${
      store.table.getNextColor() === 'black' ? '黑' : '白'
    }棋)回合`
  }

  return (
    <div className="main col-center">
      <span>{JSON.stringify(store.gameState)}</span>
      <div className="stage col">
        <div className="row">
          <div>
            <div className={`header ${tips.class}`}>
              <div
                className={`tips ${(!store.gameState.isActive ||
                  store.control.gameMode === 'AI|AI') &&
                  'opacity'}`}
              >
                {tips.text}
              </div>
            </div>
            <Stage
              isActive={store.gameState.isActive}
              nextColor={store.table.getNextColor()}
              table={store.cellTableForRender}
              isUserRound={store.gameState.isUserRound}
              onUserSelect={(x, y) => store.setCell(x, y)}
              userRoundTips={store.information.userRoundTips}
            />
          </div>
          <div className="control">
            <div className="control-item">
              <span>危险提示</span>
              <Switch
                disabled={store.control.gameMode === 'AI|AI'}
                checked={store.control.isShowDangerTips}
                onChange={v => {
                  store.toggleIsShowDangerTips()
                }}
              />
            </div>
            <div className="control-item">
              <span>对弈模式 </span>
              <Select
                style={{ width: 120 }}
                value={store.control.gameMode}
                onChange={(v: typeof store.control.gameMode) => store.changeGameMode(v)}
              >
                {store.control.gameModeOptions.map(mode => (
                  <Select.Option title={mode.label} value={mode.value} key={mode.value}>
                    {mode.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="control-item row-center margin-top">
              <Button onClick={() => store.start()}>开始</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Game
