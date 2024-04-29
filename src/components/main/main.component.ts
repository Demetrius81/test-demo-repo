import './main.scss';

export default class MainComponent {
  private readonly rootV: HTMLElement;

  public get root(): HTMLElement {
    return this.rootV;
  }

  constructor() {
    this.rootV = document.createElement('div');
    this.rootV.className = 'main';
  }
}
