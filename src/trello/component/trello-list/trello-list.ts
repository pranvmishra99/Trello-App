import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { CardType } from "src/trello/business/models/card-model";
import styles from "./trello-list.scss";
import { ListType } from "src/trello/business/models/list-model";
import { DndService } from "src/trello/business/services/Dnd-service";
import { TrelloCard } from "../trello-card/trello-card";

@customElement("trello-list")
export class TrelloList extends LitElement {
  static styles = [styles]
  @property({ attribute: false }) list!: ListType
  @property({ attribute: false }) dndService!: DndService
  private sourceList!: TrelloList
  private draggedCard!: TrelloCard

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener("drop", this.handleDrop)
    this.addEventListener("dragover", this.handleDragOver)
    this.addEventListener("dragstart", this.handleDragStart)
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("drop", this.handleDrop)
    this.removeEventListener("dragover", this.handleDragOver)
    this.removeEventListener("dragstart", this.handleDragStart)
  }

  private formatDate(): string {
    const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date: Date = new Date();
    const day: string = String(date.getDate()).padStart(2, "0");
    const month: string = months[date.getMonth()];
    return `${day} ${month}`;
  }
  

  render() {
    return html`
      <div class="list-container">
        <div class="list-header">
          <span class="list-title">${this.list.title}</span>
        </div>
        <div class="card-container">
          ${this.list.cards.map(
            (card: CardType) => html`
              <trello-card .card=${card} .date=${this.formatDate()} @delete-card=${this.handleDeteleCard} @onDragStart=${this.onDragStart} ></trello-card>
            `
          )}
        </div>
        <div class="add-card-container">
          <input
            type="text"
            class="add-card-input"
            placeholder="Add a card..."
            @keydown=${this.handleAddCard}
          />
        </div>
      </div>
    `;
  }

  private handleDeleteList() {
    this.dispatchEvent(new CustomEvent("delete-list", { detail: this.list }));
  }
  

  private handleAddCard = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      const input = event.target as HTMLInputElement;
      const cardText = input.value.trim();
      if (cardText) {
        const cardId = String(Date.now());
        const newCard = { id: cardId, text: cardText, listId: this.list.id, lastUpdated: this.formatDate() };
        this.list.cards.push(newCard)
        input.value = "";
        this.requestUpdate();
      }
    }
  }

  private handleDeteleCard = (event: CustomEvent<CardType>) => {
    const cardToDelete = event.detail
    const cardIndex = this.list.cards.findIndex(
      (card) => card.id === cardToDelete.id
    )
    if(cardIndex >= 0) {
      this.list.cards.splice(cardIndex, 1)
      this.requestUpdate()
    }
  }

  private handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    const targetList = e.currentTarget as TrelloList
    this.dndService.targetList = targetList
    const target = targetList.shadowRoot?.querySelector(".card-container") as HTMLElement
    target.appendChild(this.dndService.draggedCard)
    this.dispatchEvent(new Event("Done"))
  }

  private handleDragStart = (e: DragEvent) => {
    this.sourceList = e.currentTarget as TrelloList
    this.dndService.sourceList = this.sourceList
  }

  private onDragStart = (e: CustomEvent) => {
    this.draggedCard = e.detail as TrelloCard
    this.dndService.draggedCard = this.draggedCard
  }

  private handleDrop = (e: DragEvent) => {
    e.preventDefault()
    this.dndService.updateBoardState()
    this.dispatchEvent(new Event("update-board"))
    console.log("Done")
  }
}
