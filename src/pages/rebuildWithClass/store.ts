import { observable, configure, action } from 'mobx'
import { Table, ColorType } from './Table'

configure({ enforceActions: 'always' })

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
    gameModeOptions: [{ label: 'AI', value: 'AI', firstPlayer: 'USER', secondPlayer: 'AI' }] as {
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
    userRoundTips: []
  }

  @action
  toggleIsShowDangerTips() {
    this.control.isShowDangerTips = !this.control.isShowDangerTips
  }
  @action
  setCell(x: number, y: number) {
    this.cellTableForRender[x][y] = this.table.getNextColor()
    this.table.setCell(x, y)
    this.gameState = {
      isActive: !this.table.isFull && !this.table.isOver,
      isUserRound: (this.table.getNextPlayer() as PlayerType) === 'USER'
    }
  }
  @action
  changeGameMode(v: GameModeType) {
    this.control.gameMode = v
    this.table = this.createTable()
    this.cellTableForRender = this.table.getCellTableForRender()
    this.gameState = {
      isActive: true,
      isUserRound: (this.table.getNextPlayer() as PlayerType) === 'USER'
    }
  }
  @action
  start() {
    this.table = this.createTable()
    this.cellTableForRender = this.table.getCellTableForRender()
    this.gameState = {
      isActive: true,
      isUserRound: (this.table.getNextPlayer() as PlayerType) === 'USER'
    }
  }
  constructor() {
    this.table = this.createTable()
    this.cellTableForRender = this.table.getCellTableForRender()
    this.gameState = {
      isActive: true,
      isUserRound: (this.table.getNextPlayer() as PlayerType) === 'USER'
    }
  }
  initTable() {
    this.createTable()
  }
  private createTable() {
    const option = this.control.gameModeOptions.find(i => i.value === this.control.gameMode)
    if (!option) throw Error('default option not found')
    return new Table(
      defaultConfig.size,
      defaultConfig.firstColor,
      option.firstPlayer,
      option.secondPlayer
    )
  }
  private getCurrentModeOption() {
    const option = this.control.gameModeOptions.find(i => i.value === this.control.gameMode)
    if (!option) throw Error('option not found')
    return option
  }
}

export default new Store()
