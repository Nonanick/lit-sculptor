import { TemplateResult } from "lit-element";
import { BaseElement } from "../../base/BaseElement";

export class AppMenu extends BaseElement {
  template(): TemplateResult {
    throw new Error("Method not implemented.");
  }

}

customElements.define('app-layout-menu', AppMenu);