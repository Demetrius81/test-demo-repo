import ChatStorage from 'src/utilities/storage';
import BaseController from '../base/base.controller';
import type ContactsComponent from './contacts.component';
import WebSocketService from 'src/services/websocket.service';
import UserComponent from '../user/user.component';
import UserController from '../user/user.controller';
import { UserStatus } from 'src/types/status';

export default class ContactsController extends BaseController {
  private componentV: ContactsComponent;

  private webServiceV: WebSocketService;

  private usserOnlineControllersV: UserController[] = [];

  private usserOfflineControllersV: UserController[] = [];

  public get usserOnlineControllers(): UserController[] {
    return this.usserOnlineControllersV;
  }

  public set usserOnlineControllers(value: UserController[]) {
    this.usserOnlineControllersV = value;
  }

  public get usserOfflineControllers(): UserController[] {
    return this.usserOfflineControllersV;
  }

  public set usserOfflineControllers(value: UserController[]) {
    this.usserOfflineControllersV = value;
  }

  constructor(component: ContactsComponent) {
    super();
    this.componentV = component;
    this.webServiceV = WebSocketService.Instance;
  }

  public override run(): void {
    this.addEventListeners();
  }

  private addEventListeners = (): void => {
    document.body.addEventListener('allonlineusersrecived', this.onlineUserHandler);
    document.body.addEventListener('allofflineusersrecived', this.offlineUserHandler);
    document.body.addEventListener('userlogin', this.userLoginHandler);
    document.body.addEventListener('userlogout', this.userLogoutHandler);
    document.body.addEventListener('extuserlogin', this.extUserLoginLogoutHandler);
    document.body.addEventListener('extuserlogout', this.extUserLoginLogoutHandler);
    this.componentV.findInput.addEventListener('input', this.inputFindHandler);
  };

  private extUserLoginLogoutHandler = (): void => {
    this.userLogoutHandler();
    this.userLoginHandler();
  };

  private onlineUserHandler = (): void => {
    const ussersOnline = ChatStorage.usersOnline.map((user) => {
      const component = new UserComponent();
      component.setDataId(user.login);
      component.setUserName(user.login);
      component.setDataStatus(user.isLogined ? UserStatus.online : UserStatus.offline);

      const controller = new UserController(component, user);
      controller.run();
      this.usserOnlineControllersV.push(controller);

      return component;
    });

    this.componentV.usersList.prepend(...ussersOnline.map((uc) => uc.root));
  };

  private offlineUserHandler = (): void => {
    const ussersOffline = ChatStorage.usersOffline.map((user) => {
      const component = new UserComponent();
      component.setDataId(user.login);
      component.setUserName(user.login);
      component.setDataStatus(user.isLogined ? UserStatus.online : UserStatus.offline);

      const controller = new UserController(component, user);
      controller.run();
      this.usserOfflineControllersV.push(controller);

      return component;
    });

    this.componentV.usersList.append(...ussersOffline.map((uc) => uc.root));
  };

  private inputFindHandler = (e: Event): void => {
    const text = (<HTMLInputElement>e.target).value;
    this.componentV.usersList.innerHTML = '';

    this.componentV.usersList.append(
      ...[
        ...this.usserOnlineControllersV.map((uc) => uc.component),
        ...this.usserOfflineControllersV.map((uc) => uc.component),
      ]
        .filter((user) => user.getDataId().toLowerCase().startsWith(text.toLowerCase()))
        .map((u) => u.root),
    );
  };

  private userLoginHandler = (): void => {
    this.webServiceV.getUsersOnline();
    this.webServiceV.getUsersOffline();
  };

  private userLogoutHandler = (): void => {
    this.usserOfflineControllersV = [];
    this.usserOnlineControllersV = [];
    this.componentV.usersList.innerHTML = '';
  };
}
