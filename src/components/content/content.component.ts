import './content.scss';

export default class ContentComponent {
  private readonly rootV: HTMLElement;

  public get root(): HTMLElement {
    return this.rootV;
  }

  constructor() {
    this.rootV = document.createElement('section');
    this.rootV.className = 'main__content content';
  }
}
