import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './trello-background.scss';

@customElement('trello-background')
export class TrelloBackground extends LitElement {
  static styles = [styles];

  @property({ type: String })
  backgroundImage = '';

  private onFileInputChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.backgroundImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.backgroundImage = '';
    }
  }

  render() {
    return html`
      <div id="background-preview" style="background-image: url('${this.backgroundImage}');"></div>
      <label id="background-label" for="file-input">Add Background</label>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        @change=${this.onFileInputChange}
      />
    `;
  }
}
