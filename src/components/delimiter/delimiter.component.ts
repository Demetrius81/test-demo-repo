import './delimiter.scss';

export default class DelimiterComponent {
  private readonly rootV: HTMLElement;

  public get root(): HTMLElement {
    return this.rootV;
  }

  constructor() {
    this.rootV = document.createElement('ul');
    this.rootV.className = 'history-delimier dialog__history-delimier';
    this.rootV.id = 'history-delimier';
    this.rootV.insertAdjacentHTML('afterbegin', `<label class="history-delimier__history-text">New Messages</label>`);
  }
}
