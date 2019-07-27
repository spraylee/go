import { observable, action, getObserverTree } from 'mobx'

type UserRoundTipList = { x: number; y: number; order: number; valueForEnemy: number }[]

const defaultConfig = {
  size: 19
}

export const createEmptyTable = () =>
  [...Array(defaultConfig.size)].map((a, i) =>
    [...Array(defaultConfig.size)].map((b, j) => ({ x: i, y: j, isEmpty: true } as Go.Cell))
  )

let pureTable = createEmptyTable()

export type GameModeType = 'AI' | 'FREE' | 'AI|AI'
type GameMode = { label: string; value: GameModeType }
const gameModeList: GameMode[] = [
  { label: '简单电脑', value: 'AI' },
  { label: '自由模式', value: 'FREE' },
  { label: '电脑打架', value: 'AI|AI' }
]

const store = observable({
  table: createEmptyTable(),
  gameState: {
    cellCount: 0,
    isShowRecommand: true,
    test: { a: 1 }
  },
  gameConfig: {
    size: defaultConfig.size,
    firstColor: 'white' as Go.Color,
    firstPlayer: 'user' as Go.PlayerType,
    secondPlayer: 'ai' as Go.PlayerType,
    mode: gameModeList[0].value,
    gameModeList
  },
  logs: ['log: '] as string[],
  userRoundTips: [] as UserRoundTipList,
  isActive: true
})

export default store

export const getPureTable = () => {
  return pureTable
}
export const setTableCell = (x: number, y: number, color: Go.Color) => {
  pureTable[x][y] = { x, y, color }
  store.table[x][y] = { x, y, color }
  store.gameState.cellCount += 1
}

export const restart = () => {
  setUserRoundTips([])
  store.isActive = true
  pureTable = createEmptyTable()
  store.gameState.cellCount = 0
  store.table = createEmptyTable()
}

export const setUserRoundTips = (
  list: { x: number; y: number; order: number; valueForEnemy: number }[]
) => (store.userRoundTips = list)

export const selectGameMode = (modeValue: GameModeType) => {
  if (modeValue === 'AI') {
    store.gameConfig.firstPlayer = 'user'
    store.gameConfig.secondPlayer = 'ai'
  } else if (modeValue === 'FREE') {
    store.gameConfig.firstPlayer = 'user'
    store.gameConfig.secondPlayer = 'user'
  } else if (modeValue === 'AI|AI') {
    store.gameConfig.firstPlayer = 'ai'
    store.gameConfig.secondPlayer = 'ai'
  }
  store.gameConfig.mode = modeValue
  restart()
}
