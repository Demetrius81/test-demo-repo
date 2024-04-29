import './header.scss';

export default class HeaderComponent {
  private readonly rootV: HTMLElement;

  private readonly userNameV: HTMLSpanElement;

  private readonly logoutBtnV: HTMLButtonElement;

  private readonly infoBtnV: HTMLButtonElement;

  private template: string = `<div class="header__info">
        <div>Fun Chat</div>
        <div>
            <span>User:</span>
            <span class="header__user">AAAAAA</span>
        </div>
    </div>
    <button type="button" class="header__button header__logout-btn button enabled">Logout</button>
    <button type="button" class="header__button header__info-btn button enabled">Info</button>`;

  public get userName(): HTMLSpanElement {
    return this.userNameV;
  }

  public get logoutBtn(): HTMLButtonElement {
    return this.logoutBtnV;
  }

  public get infoBtn(): HTMLButtonElement {
    return this.infoBtnV;
  }

  public get root(): HTMLElement {
    return this.rootV;
  }

  constructor() {
    this.rootV = document.createElement('header');
    this.rootV.className = 'header main__header';
    this.rootV.insertAdjacentHTML('afterbegin', this.template);
    this.userNameV = this.rootV.querySelector('.header__user')!;
    this.logoutBtnV = this.rootV.querySelector('.header__logout-btn')!;
    this.infoBtnV = this.rootV.querySelector('.header__info-btn')!;
  }
}
