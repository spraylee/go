import { GameModeType } from './store'
import { Table } from './Table'
import { Modal } from 'antd'
import React from 'react'

export const showGameOverTips = (table: Table, mode: GameModeType, isShowRecommand: boolean) => {
  console.log(1)
  if (!table.isOver) return
  let overMessage = ''
  if (mode === 'AI' && table.getNextPlayer().type === 'AI') {
    overMessage = isShowRecommand ? '你侥幸击败了简单电脑' : '你击败了简单电脑'
  } else if (mode === 'AI' && table.getNextPlayer().type === 'USER') {
    overMessage = '你居然输给了简单电脑，菜鸡...'
  } else if (table.winColor) {
    overMessage = `${table.winColor === 'black' ? '黑棋' : '白棋'}获胜`
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
