import { html, internalProperty } from "lit-element";
import { BaseElement } from "../base/BaseElement";
import { Page } from "../page/Page";

export class Body extends BaseElement {

  @internalProperty()
  protected page?: Page;

  async currentPage(page?: Page): Promise<Page | undefined> {
    if (page != null) {
      this.page = page;
      await this.updateComplete;
    }
    return this.page;
  }

  template() {
    return html`
      ${this.page}
    `;
  }
}

customElements.define('sculptor-body', Body);