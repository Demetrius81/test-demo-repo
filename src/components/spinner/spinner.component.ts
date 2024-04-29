import './spinner.scss';

export default class SpinnerComponent {
  private readonly rootV: HTMLDivElement;

  private messageV: HTMLParagraphElement;

  public set message(value: string) {
    this.messageV.textContent = value;
  }

  public get message(): HTMLParagraphElement {
    return this.messageV;
  }

  public get root(): HTMLDivElement {
    return this.rootV;
  }

  constructor() {
    this.rootV = document.createElement('div');
    this.rootV.className = 'spinner';
    const spinner = document.createElement('div');
    spinner.className = 'spinner__item';
    this.messageV = document.createElement('p');
    this.messageV.className = 'spinner__text';
    this.messageV.textContent = 'Waiting for connection to server...';
    this.rootV.append(spinner, this.messageV);
  }
}
