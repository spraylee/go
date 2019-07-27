import { observable, action, getObserverTree } from 'mobx'

const defaultConfig = {
  size: 19
}

const tableEmpty: Go.table = [...Array(defaultConfig.size)].map((a, i) =>
  [...Array(defaultConfig.size)].map((b, j) => ({ x: i, y: j, isEmpty: true } as Go.Cell))
)

// class Store {
//   @observable table: Go.table = tableEmpty
//   @observable gameConfig = {
//     size: defaultConfig.size,
//     firstColor: 'white' as Go.Color,
//     firstPlayer: 'ai' as Go.PlayerType,
//     secondPlayer: 'ai' as Go.PlayerType
//   }
//   @observable gameState = { cellCount: 0 }

//   @action setTable(newTable: Go.table) {
//     this.table = newTable
//   }
//   @action setGameState(newGameState: { cellCount: number }) {
//     this.gameState = newGameState
//   }
//   @action setGameConfig(newGameConfig: {
//     size: number
//     firstColor: Go.Color
//     firstPlayer: Go.PlayerType
//     secondPlayer: Go.PlayerType
//   }) {
//     this.gameConfig = newGameConfig
//   }
// }

// export default new Store()

const state = observable({
  table: tableEmpty,
  gameState: {
    cellCount: 0
  },
  gameConfig: {
    size: defaultConfig.size,
    firstColor: 'white' as Go.Color,
    firstPlayer: 'ai' as Go.PlayerType,
    secondPlayer: 'ai' as Go.PlayerType
  },
  logs: ['log: '] as string[]
})

export default {
  table: state.table,
  gameState: state.gameState,
  gameConfig: state.gameConfig,
  logs: state.logs,
  pureTable: tableEmpty
  // setTable: action((newTable: Go.Cell[][]) => (state.table = newTable)),
  // setGameState: action(() => {
  //   console.log(state.gameState)
  //   state.gameState.cellCount += 1
  //   console.log(state.gameState)
  // }),
  // setGameConfig: action(
  //   (newConfig: {
  //     size: number
  //     firstColor: Go.Color
  //     firstPlayer: Go.PlayerType
  //     secondPlayer: Go.PlayerType
  //   }) => (state.gameConfig = newConfig)
  // )
}
