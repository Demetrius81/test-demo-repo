import WebSocketService from 'src/services/websocket.service';
import type LoginComponent from './login.component';
import Utilities from 'src/utilities/utilities';
import ChatStorage from 'src/utilities/storage';
import type IUser from 'src/types/user';
import EventGenerator from 'src/services/event-generator';
import BaseController from '../base/base.controller';
import Routes from 'src/types/routes';
import Router from 'src/router/router';

export default class LoginController extends BaseController {
  private componentV: LoginComponent;

  private webserviceV: WebSocketService;

  private validateParamsV: {
    isNameLenCorrect: boolean;
    isNameCharCorrect: boolean;
    isPassLenCorrect: boolean;
    isPassCharCorrect: boolean;
  } = { isNameLenCorrect: false, isNameCharCorrect: false, isPassLenCorrect: false, isPassCharCorrect: false };

  private userFronStorageV: IUser | null;

  public get validateParams(): {
    isNameLenCorrect: boolean;
    isNameCharCorrect: boolean;
    isPassLenCorrect: boolean;
    isPassCharCorrect: boolean;
  } {
    return this.validateParamsV;
  }

  public set validateParams(value: {
    isNameLenCorrect: boolean;
    isNameCharCorrect: boolean;
    isPassLenCorrect: boolean;
    isPassCharCorrect: boolean;
  }) {
    this.validateParamsV = value;
  }

  public get webservice(): WebSocketService {
    return this.webserviceV;
  }

  constructor(component: LoginComponent) {
    super();
    this.webserviceV = WebSocketService.Instance;
    this.componentV = component;
    this.userFronStorageV = LoginController.getUserFromSessionStorage();
  }

  public override run(): void {
    Utilities.hideComponent(this.componentV.root);
    Utilities.disableElement(this.componentV.loginBtn);
    this.addEventListeners();
    document.body.addEventListener('connectionopen', this.tryLoginWitnStorageData);
  }

  private tryLoginWitnStorageData = (): void => {
    if (this.userFronStorageV) {
      this.userLogoutHandler();
      const { login } = this.userFronStorageV;
      const pass = this.userFronStorageV.password!;
      setTimeout(() => {
        this.componentV.userName.value = login;
        this.componentV.userPassword.value = pass;
        this.submitEventHandler(new SubmitEvent('submit', { bubbles: true, composed: true, cancelable: true }));
      }, 0);
      document.body.removeEventListener('connectionopen', this.tryLoginWitnStorageData);
    }
  };

  private addEventListeners = (): void => {
    this.componentV.root.addEventListener('submit', this.submitEventHandler);
    this.componentV.infoBtn.addEventListener('click', LoginController.toInfoEventHandler);
    this.componentV.userName.addEventListener('input', this.inputNameEventHandler);
    this.componentV.userPassword.addEventListener('input', this.inputPasswordEventHandler);
    document.body.addEventListener('userloginrecived', this.messageRecivedHandler);
    document.body.addEventListener('userlogout', this.userLogoutHandler);
    document.body.addEventListener('movetologin', this.routeToLoginHandler);
    document.body.addEventListener('movetomain', this.routeToChatHandler);
    document.body.addEventListener('movetoabout', this.routeToAboutHandler);
  };

  private routeToLoginHandler = (): void => {
    Utilities.showComponent(this.componentV.root);
  };

  private routeToChatHandler = (): void => {
    Utilities.hideComponent(this.componentV.root);
  };

  private routeToAboutHandler = (): void => {
    Utilities.hideComponent(this.componentV.root);
  };

  private userLogoutHandler = (): void => {
    sessionStorage.removeItem('user');
    ChatStorage.clearStorage();
    this.componentV.userName.value = '';
    this.componentV.userPassword.value = '';
    Utilities.showComponent(this.componentV.root);
    Utilities.disableElement(this.componentV.loginBtn);
  };

  private static getUserFromSessionStorage = (): IUser | null => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  };

  private submitEventHandler = (e: SubmitEvent): void => {
    e.preventDefault();

    const user: IUser = {
      login: this.componentV.userName.value,
      password: this.componentV.userPassword.value,
    };

    ChatStorage.user = user;
    this.login(user);
  };

  private login = (user: IUser): void => {
    EventGenerator.generateEvent('showspinner');
    ChatStorage.spinnerMessage = 'Authorization in progress...';
    this.webserviceV.loginUser(user);
  };

  private static toInfoEventHandler = (): void => {
    ChatStorage.pathToBack = Routes.login;
    Router.route(Routes.info);
  };

  private inputNameEventHandler = (e: Event): void => {
    const text = (<HTMLInputElement>e.target).value;

    if (Utilities.validateIsSomeLetter(text)) {
      Utilities.hideComponent(this.componentV.warningName);
    } else {
      Utilities.showComponent(this.componentV.warningName);
    }

    if (Utilities.validateIsCorrectLenght(text)) {
      Utilities.hideComponent(this.componentV.warningNameLen);
    } else {
      Utilities.showComponent(this.componentV.warningNameLen);
    }

    this.activateLogin();
  };

  private inputPasswordEventHandler = (e: Event): void => {
    const text = (<HTMLInputElement>e.target).value;

    if (Utilities.validateIsSomeLetterOrNum(text) && Utilities.validateIsDiffCases(text)) {
      Utilities.hideComponent(this.componentV.warningPass);
    } else {
      Utilities.showComponent(this.componentV.warningPass);
    }

    if (Utilities.validateIsCorrectLenght(text)) {
      Utilities.hideComponent(this.componentV.warningPassLen);
    } else {
      Utilities.showComponent(this.componentV.warningPassLen);
    }

    this.activateLogin();
  };

  private activateLogin = (): void => {
    const isActivate: boolean =
      this.componentV.warningName.classList.contains('hidden') &&
      this.componentV.warningNameLen.classList.contains('hidden') &&
      this.componentV.warningPass.classList.contains('hidden') &&
      this.componentV.warningPassLen.classList.contains('hidden') &&
      this.componentV.userName.value.length > 0 &&
      this.componentV.userPassword.value.length > 0;

    if (isActivate) {
      Utilities.enableElement(this.componentV.loginBtn);
    } else {
      Utilities.disableElement(this.componentV.loginBtn);
    }
  };

  private messageRecivedHandler = (): void => {
    const userString = JSON.stringify(ChatStorage.user);
    sessionStorage.setItem('user', userString);
    Utilities.hideComponent(this.componentV.root);
    EventGenerator.generateEvent('userlogin');
  };
}
