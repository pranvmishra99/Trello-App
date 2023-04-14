import { TrelloBoard } from "src/trello/component/trello-board/trello-board"
import { TrelloCard } from "src/trello/component/trello-card/trello-card"
import { TrelloList } from "src/trello/component/trello-list/trello-list"
import { BoardType } from "../models/board-model"

export class DndService {
  public sourceList!: TrelloList
  public targetList!: TrelloList
  public boardState!: BoardType
  public draggedCard!: TrelloCard 

  constructor(
    sourceList: TrelloList | null,
    targetList: TrelloList | null,
    boardState: BoardType | null,
    draggedCard: TrelloCard | null
  ) {
    this.boardState = boardState as BoardType
    this.sourceList = sourceList as TrelloList
    this.targetList = targetList as TrelloList
    this.draggedCard = draggedCard as TrelloCard
  }

  public updateBoardState() {
    this.boardState.lists.map((list) => {
      if( this.sourceList.list.id === list.id ){
        const cardIndex = list.cards.findIndex((card) => card.id === this.draggedCard.card.id)
        cardIndex >= 0 ? list.cards.splice(cardIndex, 1) : '' 
      }
      else if( this.targetList.list.id === list.id ){
        list.cards.push(this.draggedCard.card)
      }
    })
  }
}