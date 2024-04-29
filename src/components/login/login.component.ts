import './login.scss';

export default class LoginComponent {
  private readonly rootV: HTMLFormElement;

  private readonly userNameV: HTMLInputElement;

  private readonly userPasswordV: HTMLInputElement;

  private readonly loginBtnV: HTMLButtonElement;

  private readonly infoBtnV: HTMLButtonElement;

  private readonly warningNameV: HTMLElement;

  private readonly warningPassV: HTMLElement;

  private readonly warningPassLenV: HTMLElement;

  private readonly warningNameLenV: HTMLElement;

  private template: string = `<fieldset class="login__fields-box">
        <legend>Authorization</legend>
        <div class="login__input-box">
            <label class="login__input-label">Name</label>
            <div class="login__input-container">
                <input
                    id="name"
                    class="login__text-box text-input"
                    placeholder="Enter your name"
                    type="text"
                >
                <span id="name-warning-len" class="login__warning hidden">Length must be more than 3 characters.</span>
                <span id="name-warning" class="login__warning hidden">Use only Latin letters.</span>
            </div>
        </div>
        <div class="login__input-box">
            <label class="login__input-label">Password</label>
            <div class="login__input-container">
                <input
                    id="password"
                    class="login__text-box text-input"
                    placeholder="Enter password"
                    type="password"
                >
                <span id="password-warning-len" class="login__warning hidden">Length must be more than 3 characters.</span>
                <span id="password-warning" class="login__warning hidden">Use uppercase and lowercase letters and numbers.</span>
            </div>
        </div>
    </fieldset>
    <button type="submit" id="submit" class="login__button button enabled" >Login</button>
    <button type="button" id="info" class="login__button button enabled">Info</button>`;

  public get warningNameLen(): HTMLElement {
    return this.warningNameLenV;
  }

  public get warningPassLen(): HTMLElement {
    return this.warningPassLenV;
  }

  public get warningName(): HTMLElement {
    return this.warningNameV;
  }

  public get warningPass(): HTMLElement {
    return this.warningPassV;
  }

  public get root(): HTMLFormElement {
    return this.rootV;
  }

  public get userName(): HTMLInputElement {
    return this.userNameV;
  }

  public get userPassword(): HTMLInputElement {
    return this.userPasswordV;
  }

  public get loginBtn(): HTMLButtonElement {
    return this.loginBtnV;
  }

  public get infoBtn(): HTMLButtonElement {
    return this.infoBtnV;
  }

  constructor() {
    this.rootV = document.createElement('form');
    this.rootV.className = 'login';
    this.rootV.insertAdjacentHTML('afterbegin', this.template);
    this.userNameV = this.rootV.querySelector('#name')!;
    this.userPasswordV = this.rootV.querySelector('#password')!;
    this.loginBtnV = this.rootV.querySelector('#submit')!;
    this.infoBtnV = this.rootV.querySelector('#info')!;
    this.warningNameV = this.rootV.querySelector('#name-warning')!;
    this.warningNameLenV = this.rootV.querySelector('#name-warning-len')!;
    this.warningPassV = this.rootV.querySelector('#password-warning')!;
    this.warningPassLenV = this.rootV.querySelector('#password-warning-len')!;
  }
}
