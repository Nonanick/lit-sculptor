import { html, internalProperty } from "lit-element";
import { BaseElement } from "../base/BaseElement";
import { Page } from "../page/Page";
import { Body } from "./Body";

export class Layout extends BaseElement {

  protected page?: Page;

  protected elements: {
    [name: string]: BaseElement;
  } = {};

  @internalProperty()
  protected body: Body = new Body;

  getBody() {
    return this.body;
  }

  async add(piece: string, element: BaseElement) {
    this.elements[piece] = element;
    this.elements = this.elements;
    await this.updateComplete;
  }

  has(piece: string): boolean {
    return this.elements[piece] != null;
  }

  template() {
    return html`
    ${this.elements}
    ${this.body}
    `;
  }
}

customElements.define('sculptor-layout', Layout);