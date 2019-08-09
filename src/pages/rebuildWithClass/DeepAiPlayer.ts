import { EasyAI } from './AiPlayer'
import { ColorType, Color, Table } from './Table'

class DeepTree {
  deep: number
  rootTable: Table
  nodeList: DeepTreeNode[] = []
  constructor(table: Table, targetColor: ColorType, deep: number = 3) {
    this.deep = deep
    this.rootTable = table
    this.nodeList.forEach(node => {
      node.getChildNodeList()
    })
    // Todo: compute best node
  }
}
class DeepTreeNode {
  // currentDeep: number
  // x:number
  // y:number
  // table: Table
  // valueForSelf: number
  // valueForEnemy: number
  nodeList: DeepTreeNode[] = []
  constructor() {}
  getChildNodeList() {
    this.nodeList = []
    this.nodeList.forEach(i => {
      i.getChildNodeList()
    })
  }
}

class DeepAiPlayer extends EasyAI {
  computeForSelf() {
    return this.computeForColor(this.color)
  }
  computeForColor(color: ColorType) {
    const positionList = EasyAI.getImportantCellList(this.table).map(position => ({
      valueForSelf: this.countValue(position.x, position.y, color) * 1.1,
      valueForEnemy: this.countValue(position.x, position.y, Color.anotherColor(color)),
      x: position.x,
      y: position.y
    }))
    positionList.sort((a, b) =>
      a.valueForSelf + a.valueForEnemy + Math.random() - 0.5 > b.valueForSelf + b.valueForEnemy
        ? -1
        : 1
    )
    return positionList.map((i, j) => ({ ...i, order: j }))
  }
}
