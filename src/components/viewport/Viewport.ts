import { html, internalProperty } from "lit-element";
import { App } from "../../app/App";
import { BaseElement } from "../base/BaseElement";
import { Layout } from "../layout/Layout";

export class Viewport extends BaseElement {

  @internalProperty()
  protected layout: Layout = new Layout;
  constructor(protected app: App) {
    super();

    this.capture(
      "getApp",
      (ev: CustomEvent<{ target: BaseElement; }>) => {
        ev.detail.target.setApp(this.app);
        ev.stopPropagation();
      }
    );
  }

  getApp() {
    return this.app;
  }

  getLayout() {
    return this.layout;
  }

  async setLayout(layout: Layout) {
    let currentPage = await this.getLayout().getBody().currentPage();
    this.layout = layout;
    await layout.getBody().currentPage(currentPage);
  }

  template() {
    return html``;
  }

}

customElements.define('sculptor-viewport', Viewport);