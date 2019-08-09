import { EasyAI } from './AiPlayer'
import { ColorType, Color, Table } from './Table'
import { tsImportEqualsDeclaration } from '@babel/types'

const maxChooseInOneStep = 5

class DeepTreeRoot {
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
  getChildNodeList() {}
}

interface DeepTreeNodeConfig {
  table: Table
  deep: number
  maxDeep: number
  isSelfRound: boolean
  x: number
  y: number
  valueForSelf: number
  valueForEnemy: number
  path: { x: number; y: number }[]
}
class DeepTreeNode {
  x: number
  y: number
  valueForSelf: number
  valueForEnemy: number
  deep: number
  maxDeep: number
  isSelfRound: boolean
  table: Table
  nodeList: DeepTreeNode[] = []
  path: { x: number; y: number }[] = []
  constructor({
    table,
    deep,
    maxDeep,
    isSelfRound,
    x,
    y,
    valueForSelf,
    valueForEnemy,
    path
  }: DeepTreeNodeConfig) {
    this.table = table
    this.deep = deep
    this.maxDeep = maxDeep
    this.isSelfRound = isSelfRound
    this.x = x
    this.y = y
    this.valueForSelf = valueForSelf
    this.valueForEnemy = valueForEnemy
    this.path = [...path, { x, y }]
  }
  getChildNodeList() {
    if (this.deep >= this.maxDeep || this.table.isFull || this.table.isOver) {
      this.nodeList = []
    } else {
      const easyAI = new EasyAI(this.table, this.table.getNextColor())
      const recommand = easyAI.computeForSelf().slice(0, maxChooseInOneStep)
      this.nodeList = recommand.map(i => {
        const newTable = new Table(this.table.size, this.table.firstColor)
        newTable.cloneContentFrom(this.table)
        newTable.setCell(i.x, i.y)
        return new DeepTreeNode({
          ...i,
          table: newTable,
          deep: this.isSelfRound ? this.deep : this.deep + 1,
          maxDeep: this.maxDeep,
          isSelfRound: !this.isSelfRound,
          path: this.path
        })
      })
    }
    this.nodeList.forEach(node => {
      node.getChildNodeList()
    })
  }
  getBetterLeafValue(): number {
    if (this.nodeList.length) {
      this.nodeList.sort((a, b) => {
        const valueA = a.getBetterLeafValue()
        const valueB = b.getBetterLeafValue()
        if (this.isSelfRound) {
          return valueA > valueB ? -1 : 1
        } else {
          return valueA > valueB ? 1 : -1
        }
      })
      const best = this.nodeList[0]
      return Math.max(
        best.getBetterLeafValue(),
        (this.valueForEnemy + this.valueForSelf * 1.1) * (this.isSelfRound ? 1 : -1)
      )
    } else {
      return (this.valueForEnemy + this.valueForSelf * 1.1) * (this.isSelfRound ? 1 : -1)
    }
  }
}

export class DeepAiPlayer extends EasyAI {
  maxDeep = 3
  nodeList: DeepTreeNode[] = []
  constructor(table: Table, color: ColorType) {
    super(table, color)
  }
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
  deepCompute() {
    const table = this.table
    const color = this.color
    this.nodeList = this.computeForColor(color)
      .slice(0, maxChooseInOneStep)
      .map(i => {
        const newTable = new Table(table.size, table.firstColor)
        newTable.cloneContentFrom(table)
        newTable.setCell(i.x, i.y)
        return new DeepTreeNode({
          ...i,
          table: newTable,
          deep: 1,
          maxDeep: this.maxDeep,
          isSelfRound: true,
          path: []
        })
      })
    this.nodeList.forEach(node => node.getChildNodeList())
    const best = this.getBetterNode()
    return { x: best.x, y: best.y }
    console.log(this.nodeList)
  }
  getBetterNode() {
    if (this.nodeList.length) {
      this.nodeList.sort((a, b) => {
        const valueA = a.getBetterLeafValue()
        const valueB = b.getBetterLeafValue()
        return valueA > valueB ? -1 : 1
      })
      const best = this.nodeList[0]
      console.log(this.nodeList)
      this.nodeList.forEach(i => console.log(i.getBetterLeafValue()))
      return best
    } else {
      throw Error('no root node list')
    }
  }
}
