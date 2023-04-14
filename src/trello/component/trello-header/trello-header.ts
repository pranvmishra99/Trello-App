import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import styles from "./trello-header.scss";

@customElement("trello-header")
export class TrelloHeader extends LitElement {
  static styles = [styles];

  private handleLogout() {
    this.dispatchEvent(new Event('logout'))
  }

  render() {
    return html`
      <header>
        <div class="logo">Trello</div>
        <div class="logout">
        </div>
      </header>
    `;
  }
}
