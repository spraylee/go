declare namespace Go {
  type Color = 'white' | 'black'
  type PlayerType = 'user' | 'ai'
  type Cell = { x: number; y: number; color: GoColor } | null
}
