import { LitElement, html, PropertyValues } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { BoardType } from "src/trello/business/models/board-model"
import { ListType } from "src/trello/business/models/list-model"
import { TrelloBoard } from "../../component/trello-board/trello-board"
import { TrelloHeader } from "../../component/trello-header/trello-header"
import { TrelloBackground } from "../../component/trello-background/trello-background"
import styles from "./trello-board-container.scss"

@customElement("trello-board-container")
export class TrelloBoardContainer extends LitElement {
  static styles = [styles];

  @state() board: BoardType = {
    title: "Board1",
    lists: [],
  };

  @state() isLoggedIn = false;

  connectedCallback(): void {
    super.connectedCallback()
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true' ? true : false
    if(sessionStorage.getItem('board'))
      this.board = JSON.parse(sessionStorage.getItem('board') as string)
  }

  render() {
    return html`${this.isLoggedIn
      ? html` <div class="board-container">
          <trello-header @logout=${this.handleLogout}></trello-header>
          <trello-board
            .board=${this.board}
            @add-list=${this.handleAddList}
          ></trello-board>
        </div>`
      : html`<trello-login
          @login=${this.handleLogin}
        ></trello-login>`}`
  }

  private handleLogout = (event: Event) => {
    sessionStorage.clear()
    this.isLoggedIn = false;
    this.board = {
      title: this.board.title,
      lists: []
    }
    this.requestUpdate()
  }

  private handleLogin = (event: Event) => {
    this.isLoggedIn = true
    sessionStorage.setItem('isLoggedIn', 'true')
    this.requestUpdate()
  }

  private handleAddList = (event: CustomEvent) => {
    const newList: ListType = {
      id: String(Date.now()),
      title: event.detail,
      cards: [],
    };
    this.board.lists.push(newList);
  };
}
