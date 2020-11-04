import { LitElement, property, TemplateResult } from "lit-element";
import { App } from "../../app/App";

export abstract class BaseElement extends LitElement {

  protected app?: App;

  protected _eventListeners: {
    [type: string]: EventListener[];
  } = {};

  dispatch(
    event: string,
    details: any = {},
    options?: {
      bubbles?: boolean;
      cancelable?: boolean;
      composed?: boolean;
    }
  ) {

    let customEvent = new CustomEvent(
      event,
      {
        bubbles: options?.bubbles ?? false,
        cancelable: options?.cancelable ?? true,
        composed: options?.composed ?? true,
        detail: details
      }
    );

    this.dispatchEvent(customEvent);
  }

  capture<EventDetails = any>(
    event: string,
    listener: EventListener<EventDetails>,
    options?: { once: boolean; }
  ) {
    this.addEventListener(
      event,
      listener as any,
      {
        capture: true,
        once: options?.once ?? false,
        passive: false
      }
    );
  }

  addEventListener<Detail = any>(
    event: string,
    listener: EventListener<Detail> | any,
    options?: AddEventListenerOptions
  ): void {

    super.addEventListener(event, listener as any, options);

    // Keep track of all listeners
    if (this._eventListeners[event] == null) {
      this._eventListeners[event] = [];
    }

    this._eventListeners[event].push(listener as any);
  }

  removeEventListener(type?: string, listener?: EventListener | any) {

    // Type and listener provided
    if (type != null && listener != null) {
      let arr = this._eventListeners[type];
      let ioList = arr.indexOf(listener);
      if (ioList >= 0) {
        this._eventListeners[type].splice(ioList, 1);
        super.removeEventListener(type, listener);
      }
    }

    // Only type was provided
    if (type != null && listener == null) {
      let arr = this._eventListeners[type];
      for (let list of arr ?? []) {
        super.removeEventListener(type, list as any);
      }
    }

    // None ws provided
    for (let event in this._eventListeners) {
      let events = this._eventListeners[event];
      for (let list of events ?? []) {
        super.removeEventListener(event, list as any);
      }
    }
  }

  reactTo<EventDetails = any>(
    event: string,
    listener: EventListener<EventDetails>,
    options?: { once: boolean; }) {
    this.addEventListener(
      event,
      listener as any,
      {
        capture: false,
        once: options?.once ?? false,
        passive: true
      }
    );
  }

  disconnectedCallback() {
    this.removeEventListener();
    super.disconnectedCallback();
  }

  public setApp(app: App) {
    this.app = app;
  }

  public getApp() {
    this.dispatch("getApp", { target: this }, { bubbles: true, composed: true });
  }

  abstract template(): TemplateResult;

  render() {
    let baseTemplate = this.template();
    return baseTemplate;
  }

}

export type EventListener<Detail = any> = (event: CustomEvent<Detail>) => void;