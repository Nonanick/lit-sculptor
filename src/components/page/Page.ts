import { App } from "../../app/App";
import { Router } from "../../router/Router";
import { BaseElement } from "../base/BaseElement";
import { Layout } from "../layout/Layout";


export abstract class Page extends BaseElement {

  protected _isOpen: boolean = false;

  requestOpen(context: PageContext) {

  }

  requestClose(newContext: PageContext) {

  }

  abstract async guard(context: PageContext): Promise<boolean>;

  abstract async open(context: PageContext): Promise<boolean>;

  abstract async close(newContext: PageContext): Promise<boolean>;

}

export type PageContext = {
  app: App;
  router: Router;
  layout: Layout;
  url: string;
  params?: any;
  query?: any;
};