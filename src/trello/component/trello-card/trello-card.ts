import { LitElement, html, css, customElement, property, state, adoptStyles } from "lit-element";
import { CardType } from "src/trello/business/models/card-model";
import styles from "./trello-card.scss";

@customElement("trello-card")
export class TrelloCard extends LitElement {
  static styles = [styles];

  @property({ attribute: false }) card!: CardType
  @state() editMode = false
  @state() iconStyleUpdated = false

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener("dragstart", this.handleDragStart)
    this.addEventListener("dragend", this.handleDragEnd)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener("dragstart", this.handleDragStart)
    this.removeEventListener("dragend", this.handleDragEnd)
  }

  render() {
    return html`
      ${this.editMode
        ? html` <input
            type="text"
            class="edit-card-input"
            value=${this.card.text}
            @keydown=${this.handleEditCardKeyDown}
          />`
        : html`<div
            class="card-container"
            draggable="true"
          >
            <div class="card-body">
            <div class="card-text">${this.card.text}</div>
            <div class="card-actions">
              <trello-icon
                class="edit-icon"
                icon="fs-16-edit"
                @click=${this.handleEditCard}
              ></trello-icon>
              <trello-icon
                class="delete-icon"
                icon="fs-16-trash"
                @click=${this.handleDeleteCard}
              ></trello-icon>
            </div>
            </div>
            <div class="card-time">
              <trello-icon class="clock-icon" icon="fs-16-clock"></trello-icon>
              <span class="card-time-text"> ${this.card.lastUpdated}</span>
            </div>
          </div>`}
    `
  }

  private handleEditCardKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      const input = event.target as HTMLInputElement
      const newCardText = input.value.trim()
      if(!newCardText)
      {
        alert('card text can\'t be empty')
        return
      }
      if (newCardText !== this.card.text) {
        const updatedCard = { ...this.card, text: newCardText }
        // this.dispatchEvent(new CustomEvent("update-card", { detail: updatedCard }))
        this.card = updatedCard
        this.requestUpdate()
      }
      input.blur()
      this.editMode = false
      this.requestUpdate()
    }
  }
  
  private handleEditCard = () => {
    this.editMode = true
  };

  private handleDeleteCard() {
    this.dispatchEvent(new CustomEvent("delete-card", { detail: this.card }))
  }

  private handleDragStart = (event: DragEvent) => {
    const target = event.currentTarget as TrelloCard;
    this.classList.add(".is-dragging")
    target.shadowRoot
      ?.querySelector(".card-container")
      ?.classList.add("onHover")
    setTimeout(() => {
      target.shadowRoot
        ?.querySelector(".card-container")
        ?.classList.add("hide")
    }, 0);
    this.dispatchEvent(new CustomEvent('onDragStart', {detail: this}))
  }

  private handleDragEnd = (event: DragEvent) => {
    const target = event.currentTarget as TrelloCard;
    this.classList.remove(".is-dragging")
    target.shadowRoot
      ?.querySelector(".card-container")
      ?.classList.remove("onHover")
    target.shadowRoot
      ?.querySelector(".card-container")
      ?.classList.remove("hide")
  };
}
