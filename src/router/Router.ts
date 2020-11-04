import { Page, PageContext } from "../components/page/Page";
import { match, MatchFunction, MatchResult } from 'path-to-regexp';
import { App } from "../app/App";

export class Router extends EventTarget {

  protected _currentHash?: string;

  constructor(protected app: App) {
    super();
  }

  protected _baseHash: string = "#/";

  protected _routes: {
    [urlPattern: string]: {
      matcher: MatchFunction,
      page: ResolvesToPage;
      resolved?: Page;
    };
  } = {};

  protected async resolve(url: string): Promise<boolean> {

    for (let routeUrl in this._routes) {
      let route = this._routes[routeUrl];
      let routeMatches = route.matcher(url);

      if (routeMatches !== false) {

        // resolve page element once
        if (route.resolved === undefined) {
          this._routes[routeUrl].resolved = await ResolveToPage(route.page);
        }

        await this.openPage(url, routeMatches, route.resolved!);

        return true;
      }
    }

    return false;
  }

  protected async openPage(url: string, matches: MatchResult<object>, page: Page) {

    let context: PageContext = {
      // Where it shall be inserted in
      router: this,
      app: this.app,
      layout: this.app.getLayout(),
      // Current URL
      url,
      params: matches,
      query: {}
    };

    let canEnter = await page.guard(context);
    if (!canEnter) {
      return false;
    }

    // Close previous page and await the new one to be appended
    let closeCurrentPage = await (await this.app.currentPage())?.close(context);
    await this.app.currentPage(page);

    // Open new one
    let openNewPage = await page.open(context);

    console.log('Closing previous page: ', closeCurrentPage, "\nOpening new one:", openNewPage);
  }

  protected sanitizeHash(hash: string): string {
    return hash.replace(new RegExp('^' + this._baseHash), '');
  }

  add(url: string, page: ResolvesToPage): void;
  add(...pages: RoutedPage[]): void;
  add(
    urlOrRouted: string | RoutedPage,
    pageOrRouted: ResolvesToPage | RoutedPage,
    ...restPages: RoutedPage[]
  ): void {

    if (typeof urlOrRouted === 'string' && pageOrRouted instanceof Page) {
      this._routes[urlOrRouted] = {
        matcher: match(urlOrRouted),
        page: pageOrRouted
      };
      return;
    }

    if (Array.isArray(urlOrRouted)) {
      this._routes[urlOrRouted[0]] = {
        matcher: match(urlOrRouted[0]),
        page: urlOrRouted[1]
      };
    }

    if (Array.isArray(pageOrRouted)) {
      this._routes[pageOrRouted[0]] = {
        matcher: match(pageOrRouted[0]),
        page: pageOrRouted[1]
      };
    }

    if (Array.isArray(restPages)) {
      for (let routed of restPages) {
        this._routes[routed[0]] = {
          matcher: match(routed[0]),
          page: routed[1]
        };
      }
    }

  }

  navigate(
    url: string,
    query?: any
  ) {

  };

  async apply() {
    let newHash = this.sanitizeHash(window.location.hash);
    await this.resolve(newHash);
  }

  start() {

    window.addEventListener('hashchange', async (ev) => {
      let newHash = this.sanitizeHash(window.location.hash);
      let hashChangedEv = new CustomEvent<HashChangedEventDetail>(
        "hashChanged",
        {
          bubbles: false,
          cancelable: false,
          detail: {
            oldHash: this._currentHash,
            newHash,
          }
        }
      );
      this._currentHash = newHash;
      this.dispatchEvent(hashChangedEv);

      await this.resolve(newHash);
    });
  }
}

export type RoutedPage = [url: string, page: Page];

export type ResolvesToPage = Page | (() => Page) | (() => Promise<Page>) | Promise<Page>;

async function ResolveToPage(resolves: ResolvesToPage): Promise<Page> {
  if (resolves instanceof Page) return resolves;
  if (resolves instanceof Promise) return await resolves;
  if (typeof resolves === "function") return await ResolveToPage(resolves());
  throw new Error('Cannot resolve to page: ' + resolves);
}

type HashChangedEventDetail = {
  oldHash?: string;
  newHash: string;
};