import { Layout } from "../Layout";
import { AppHeader } from "./AppHeader";
import { AppMenu } from "./AppMenu";

export class AppLayout extends Layout {

  constructor() {
    super();

    this.add('header', new AppHeader);
    this.add('menu', new AppMenu);

  }
}

customElements.define('sculptor-app-layout', AppLayout);