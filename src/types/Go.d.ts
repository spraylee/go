declare namespace Go {
  export type Color = 'white' | 'black'
  export type PlayerType = 'user' | 'ai'
  export type Cell = { x: number; y: number; color?: Color; isEmpty?: boolean }
  export type table = Cell[][]
}
