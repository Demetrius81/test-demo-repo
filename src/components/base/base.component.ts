export default class BaseComponent {
  private readonly rootV: HTMLElement;

  private readonly tagNameV: string;

  public get root(): HTMLElement {
    switch (this.tagNameV) {
      case 'form':
        return this.rootV as HTMLFormElement;
      case 'div':
        return this.rootV as HTMLFormElement;
      default:
        return this.rootV;
    }
  }

  constructor(tagName: string, className: string) {
    this.tagNameV = tagName;
    this.rootV = document.createElement(tagName);
    this.rootV.className = className;
  }
}
