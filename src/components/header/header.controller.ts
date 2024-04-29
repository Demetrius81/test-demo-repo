import EventGenerator from 'src/services/event-generator';
import BaseController from '../base/base.controller';
import type HeaderComponent from './header.component';
import ChatStorage from 'src/utilities/storage';
import WebSocketService from 'src/services/websocket.service';
import Routes from 'src/types/routes';
import Router from 'src/router/router';

export default class HeaderController extends BaseController {
  private componentV: HeaderComponent;

  private webserviceV: WebSocketService;

  constructor(component: HeaderComponent) {
    super();
    this.componentV = component;
    this.webserviceV = WebSocketService.Instance;
  }

  public override run(): void {
    this.addEventListeners();
  }

  private addEventListeners = (): void => {
    document.body.addEventListener('userlogin', this.userLoginHandler);
    this.componentV.logoutBtn.addEventListener('click', this.clickLogOutHandler);
    this.componentV.infoBtn.addEventListener('click', () => {
      ChatStorage.pathToBack = Routes.chat;
      Router.route(Routes.info);
    });
  };

  private clickLogOutHandler = (): void => {
    this.componentV.userName.textContent = '';
    this.webserviceV.logoutUser(ChatStorage.user);
    EventGenerator.generateEvent('userlogout');
  };

  private userLoginHandler = (): void => {
    this.componentV.userName.textContent = ChatStorage.user.login;
  };
}
