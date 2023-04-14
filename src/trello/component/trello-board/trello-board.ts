import { LitElement, PropertyValueMap, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BoardType } from "src/trello/business/models/board-model";
import { ListType } from "src/trello/business/models/list-model";
import { TrelloList } from "../trello-list/trello-list";
import styles from "./trello-board.scss";
import { TrelloCard } from "../trello-card/trello-card";
import { CardType } from "src/trello/business/models/card-model";
import { DndService } from "../../business/services/Dnd-service";

@customElement("trello-board")
export class TrelloBoard extends LitElement {
  static styles = [styles, TrelloList.styles];
  @property({ attribute: false }) board!: BoardType;
  @property({ attribute: false }) dndService!: DndService;
  private sourceList!: TrelloList;
  private draggedCard!: TrelloCard;
  private targetList!: TrelloList;

  connectedCallback(): void {
    super.connectedCallback();
    this.dndService = new DndService(null, null, this.board, null);
  }

  render() {
    return html`<div class="board-container">
      ${this.board.lists
        ? this.board?.lists.map(
            (list: ListType) => html`
              <trello-list
                .list=${list}
                .dndService=${this.dndService}
                @delete-list=${this.handleDeleteList}
                @update-board=${this.updateBoard}
              ></trello-list>
            `
          )
        : html``}
      <div class="add-list-container">
        <input
          type="text"
          class="add-list-input"
          placeholder="Add a list..."
          @keydown=${this.handleAddList}
        />
      </div>
    </div>`;
  }

  private handleAddList = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      const input = event.target as HTMLInputElement;
      const listTitle = input.value.trim();
      if (listTitle) {
        this.dispatchEvent(new CustomEvent("add-list", { detail: listTitle }));
        input.value = "";
        this.requestUpdate();
      }
    }
  };

  private handleDeleteList = (event: CustomEvent<ListType>) => {
    const listToDelete = event.detail;
    const listIndex = this.board.lists.findIndex(
      (list) => list.id === listToDelete.id
    );
    if (listIndex >= 0) {
      this.board.lists.splice(listIndex, 1);
      this.requestUpdate();
    }
  };

  private updateBoard = (e: Event) => {
    this.board = this.dndService.boardState
    sessionStorage.setItem('board', JSON.stringify(this.board))
    console.log(this.board)
  }
}
