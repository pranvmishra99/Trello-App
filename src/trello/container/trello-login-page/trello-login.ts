import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './trello-login.scss';

@customElement('trello-login')
export class LoginPage extends LitElement {

  static styles = [styles]

  @property({ type: String })
  email = '';

  @property({ type: String })
  password = '';

  @property({ type: Boolean })
  showError = false;

  render() {
    return html`
      <form @submit="${this.handleFormSubmit}">
        <h1>Trello Login</h1>
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            .value="${this.email}"
            @input="${this.handleEmailInput}"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            .value="${this.password}"
            @input="${this.handlePasswordInput}"
            required
          />
        </div>
        <div class="form-group">
          <button type="submit">Login</button>
        </div>
        ${this.showError
          ? html`<div class="error">Invalid email or password</div>`
          : ''}
      </form>
    `;
  }

  handleEmailInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    this.email = input.value;
  }

  handlePasswordInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    this.password = input.value;
  }

  handleFormSubmit(event: Event) {
    event.preventDefault();
    if (this.email !== '' && this.password !== '') {
      this.dispatchEvent(new Event('login'))
    } else {
      this.showError = true;
    }
  }
}
