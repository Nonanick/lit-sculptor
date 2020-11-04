import { Page } from "../components/page/Page";
import { Viewport } from "../components/viewport/Viewport";

export class App {

  protected viewport = new Viewport(this);



  constructor() {

  }

  getLayout() {
    return this.viewport.getLayout();
  }

  async currentPage(page?: Page): Promise<Page | undefined> {
    return this.viewport.getLayout().getBody().currentPage(page);
  }
}