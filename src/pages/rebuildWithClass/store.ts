import { observable, configure, action } from 'mobx'
import { Table, ColorType, UserPlayer, Color } from './Table'
import { EasyAI } from './AiPlayer'
import { untilRender } from '../home/core/common'
import { Modal } from 'antd'
import { showGameOverTips } from './Modal'

configure({ enforceActions: 'observed' })

const defaultConfig = {
  size: 19,
  firstColor: 'white' as ColorType
}
export type GameModeType = 'AI' | 'FREE' | 'AI|AI'
type PlayerType = 'AI' | 'USER'
class Store {
  table: Table
  @observable
  cellTableForRender: ('white' | 'black' | null)[][]
  @observable control = {
    isShowDangerTips: true,
    gameMode: 'AI' as GameModeType,
    gameModeOptions: [
      { label: '简单电脑', value: 'AI', firstPlayer: 'USER', secondPlayer: 'AI' },
      { label: '自由模式', value: 'FREE', firstPlayer: 'USER', secondPlayer: 'USER' },
      { label: '电脑打架', value: 'AI|AI', firstPlayer: 'AI', secondPlayer: 'AI' }
    ] as {
      label: string
      value: GameModeType
      firstPlayer: PlayerType
      secondPlayer: PlayerType
    }[]
  }
  @observable
  gameState = {
    isActive: true,
    isUserRound: true
  }
  @observable
  information = {
    userRoundTips: [] as {
      order: number
      valueForSelf: number
      valueForEnemy: number
      x: number
      y: number
    }[],
    gameOverTips: '',
    isShowGameOverTips: false
  }

  @action
  toggleIsShowDangerTips() {
    this.control.isShowDangerTips = !this.control.isShowDangerTips
    this.setRecommand()
  }
  @action
  setCell(x: number, y: number) {
    this.cellTableForRender[x][y] = this.table.getNextColor()
    this.table.setCell(x, y)
    this.gameState = {
      isActive: !this.table.isFull && !this.table.isOver,
      isUserRound: this.table.getNextPlayer().type === 'USER'
    }
    this.checkIsAiRound()
  }
  @action
  changeGameMode(v: GameModeType) {
    this.control.gameMode = v
    this.table = this.createTable()
    this.cellTableForRender = this.table.getCellTableForRender()
    this.gameState = {
      isActive: true,
      isUserRound: this.table.getNextPlayer().type === 'USER'
    }
    this.setRecommand()
  }
  @action
  start() {
    this.table = this.createTable()
    this.cellTableForRender = this.table.getCellTableForRender()
    this.gameState = {
      isActive: true,
      isUserRound: this.table.getNextPlayer().type === 'USER'
    }
    this.checkIsAiRound()
  }
  @action
  async checkIsAiRound() {
    this.setRecommand()
    await untilRender()
    if (this.table.isOver) {
      return this.showOverTips()
    }
    const nextPlayer = this.table.getNextPlayer()
    if (nextPlayer instanceof EasyAI) {
      const start = Date.now()
      const position = nextPlayer.computeForSelf()[0]
      console.log(`AI: ${Date.now() - start}ms`)
      this.setCell(position.x, position.y)
    }
  }
  @action
  setRecommand() {
    if (
      !this.control.isShowDangerTips ||
      this.table.isFull ||
      this.table.isOver ||
      this.table.getNextPlayer().type === 'AI'
    )
      return (this.information.userRoundTips = [])
    const AiForRecommand = new EasyAI(this.table, this.table.getNextColor())
    const start = Date.now()
    const recommandList = AiForRecommand.computeForSelf()
    console.log(`Recommand time: ${Date.now() - start}ms`)
    this.information.userRoundTips = recommandList
  }
  constructor() {
    this.table = this.createTable()
    this.cellTableForRender = this.table.getCellTableForRender()
    this.gameState = {
      isActive: true,
      isUserRound: this.table.getNextPlayer().type === 'USER'
    }
  }
  initTable() {
    this.createTable()
  }
  private createTable() {
    const option = this.control.gameModeOptions.find(i => i.value === this.control.gameMode)
    if (!option) throw Error('default option not found')
    const table = new Table(defaultConfig.size, defaultConfig.firstColor)
    const createPlayer = (optionPlayer: PlayerType, color: ColorType) =>
      optionPlayer === 'AI' ? new EasyAI(table, color) : new UserPlayer(color)
    table.setPlayer(
      createPlayer(option.firstPlayer, defaultConfig.firstColor),
      createPlayer(option.secondPlayer, Color.anotherColor(defaultConfig.firstColor))
    )
    return table
  }
  private getCurrentModeOption() {
    const option = this.control.gameModeOptions.find(i => i.value === this.control.gameMode)
    if (!option) throw Error('option not found')
    return option
  }
  private async showOverTips() {
    await untilRender()
    showGameOverTips(this.table, this.control.gameMode, this.control.isShowDangerTips)
  }
}

export default new Store()
