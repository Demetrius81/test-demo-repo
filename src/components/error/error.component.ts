import './error.scss';

export default class ErrorComponent {
  private readonly rootV: HTMLDivElement;

  private messageV: HTMLSpanElement;

  private readonly okBtnV: HTMLButtonElement;

  private template: string = `<div class="error__wrapper">
        <span class="error__text">WRONGGG!!!</span>
        <button type="button" class="error__button button enabled">Ok</button>
    </div>`;

  public set message(value: string) {
    this.messageV.textContent = value;
  }

  public get message(): HTMLSpanElement {
    return this.messageV;
  }

  public get okBtn(): HTMLButtonElement {
    return this.okBtnV;
  }

  public get root(): HTMLDivElement {
    return this.rootV;
  }

  constructor() {
    this.rootV = document.createElement('div');
    this.rootV.className = 'error';
    this.rootV.insertAdjacentHTML('afterbegin', this.template);
    this.messageV = this.rootV.querySelector('.error__text')!;
    this.okBtnV = this.rootV.querySelector('.error__button')!;
  }
}
