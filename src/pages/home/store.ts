import { observable, action, configure } from 'mobx'

configure({
  enforceActions: 'always'
})

type UserRoundTipList = { x: number; y: number; order: number; valueForEnemy: number }[]

const defaultConfig = {
  size: 19
}

export const createEmptyTable = () =>
  [...Array(defaultConfig.size)].map((a, i) =>
    [...Array(defaultConfig.size)].map((b, j) => ({ x: i, y: j, isEmpty: true } as Go.Cell))
  )

export type GameModeType = 'AI' | 'FREE' | 'AI|AI'
type GameMode = { label: string; value: GameModeType }
const gameModeList: GameMode[] = [
  { label: '简单电脑', value: 'AI' },
  { label: '自由模式', value: 'FREE' },
  { label: '电脑打架', value: 'AI|AI' }
]

class Store {
  private _pureTable = createEmptyTable()
  get pureTable() {
    return this._pureTable
  }
  @observable table: Go.table = createEmptyTable()
  @observable gameState = {
    cellCount: 0,
    isShowRecommand: true,
    test: { a: 1 }
  }
  @observable gameConfig = {
    size: defaultConfig.size,
    firstColor: 'white' as Go.Color,
    firstPlayer: 'user' as Go.PlayerType,
    secondPlayer: 'ai' as Go.PlayerType,
    mode: gameModeList[0].value,
    gameModeList
  }
  @observable logs: string[] = ['logs: ']
  @observable userRoundTips: UserRoundTipList = []
  @observable isActive: boolean = true

  @action
  setTableCell(x: number, y: number, color: Go.Color) {
    this.pureTable[x][y] = { x, y, color }
    this.table[x][y] = { x, y, color }
    this.gameState.cellCount += 1
  }
  @action
  restart() {
    this.setUserRoundTips([])
    this.isActive = true
    this._pureTable = createEmptyTable()
    this.gameState.cellCount = 0
    this.table = createEmptyTable()
  }
  @action
  setUserRoundTips(list: UserRoundTipList) {
    this.userRoundTips = list
  }
  @action
  selectGameMode(modeValue: GameModeType) {
    if (modeValue === 'AI') {
      this.gameConfig.firstPlayer = 'user'
      this.gameConfig.secondPlayer = 'ai'
    } else if (modeValue === 'FREE') {
      this.gameConfig.firstPlayer = 'user'
      this.gameConfig.secondPlayer = 'user'
    } else if (modeValue === 'AI|AI') {
      this.gameConfig.firstPlayer = 'ai'
      this.gameConfig.secondPlayer = 'ai'
    }
    this.gameConfig.mode = modeValue
    this.restart()
  }
  @action
  disableTable() {
    this.isActive = false
  }
  @action
  pushLog(str: string) {
    this.logs.push(str)
  }
}

export default new Store()
