import BaseController from '../base/base.controller';
import UserComponent from './user.component';
import WebSocketService from 'src/services/websocket.service';
import ChatStorage from 'src/utilities/storage';
import EventGenerator from 'src/services/event-generator';
import type IUser from 'src/types/user';
import Utilities from 'src/utilities/utilities';
import MessageController from '../message/message.controller';
import MessageComponent from '../message/message.component';

export default class UserController extends BaseController {
  private componentV: UserComponent;

  private messageControllersV: MessageController[];

  private webserviceV: WebSocketService;

  private readonly userV: IUser;

  private idV: string = '';

  public get messageControllers(): MessageController[] {
    return this.messageControllersV;
  }

  public set messageControllers(value: MessageController[]) {
    this.messageControllersV = value;
  }

  public set component(value: UserComponent) {
    this.componentV = value;
  }

  public get user(): IUser {
    return this.userV;
  }

  constructor(component: UserComponent | null, user: IUser | null) {
    super();
    this.componentV = component ?? new UserComponent();
    this.webserviceV = WebSocketService.Instance;
    this.messageControllersV = [];
    this.userV = user ?? { login: '' };
  }

  public override run(): void {
    this.idV = Utilities.generateUUID();
    this.addEventListeners();
    this.webserviceV.getMessageHistory(this.componentV.getDataId(), this.idV);
  }

  private addEventListeners = (): void => {
    this.componentV.userName.addEventListener('click', this.userNameClickHandler);
    document.body.addEventListener('msgfromuserrecived', this.msgFromUserRecivedHandler);
    document.body.addEventListener('updatecountstatus', this.updateCountStatusHandler);
    document.body.addEventListener('messageiscame', this.messageIsCamedHandler);
    document.body.addEventListener('messagedelete', this.messageDeleteHandler);
    document.body.addEventListener('messagereaded', this.messageReadedHandler);
  };

  private updateCountStatusHandler = (): void => {
    this.orderMessages();
  };

  private messageReadedHandler = (): void => {
    if (
      ChatStorage.recivedDataMessageIsCame.payload?.message?.id &&
      ChatStorage.recivedDataMessageIsCame.payload?.message?.status &&
      ChatStorage.recivedDataMessageIsCame.payload?.message?.status?.isReaded
    ) {
      this.messageControllersV.forEach((mc) => {
        if (mc.message.id === ChatStorage.recivedDataMessageIsCame.payload?.message?.id) {
          mc.setStatus(ChatStorage.recivedDataMessageIsCame.payload?.message?.status);
        }
      });
    }
  };

  public updateCountUnreaded = (): void => {
    const count: number = this.messageControllersV.filter((item) => !item.message.status?.isReaded, 0).length;
    this.componentV.setMsgCount(count);
  };

  private messageIsCamedHandler = (): void => {
    if (
      ChatStorage.recivedDataMessageIsCame &&
      ChatStorage.recivedDataMessageIsCame.payload &&
      ChatStorage.recivedDataMessageIsCame.payload.message &&
      this.userV.login === ChatStorage.recivedDataMessageIsCame?.payload?.message?.from
    ) {
      const component = new MessageComponent(ChatStorage.recivedDataMessageIsCame.payload.message.id!);
      const controller = new MessageController(component, ChatStorage.recivedDataMessageIsCame.payload.message);
      controller.run();
      this.messageControllersV.push(controller);

      this.orderMessages();
      if (!ChatStorage.recivedDataMessageIsCame?.id) {
        EventGenerator.generateEvent('addmessagetolist');
      }
    }
  };

  private messageDeleteHandler = (): void => {
    if (ChatStorage.recivedDataMessageIsCame?.payload?.message?.id) {
      const idx: number = this.messageControllersV.findIndex(
        (msc) => msc.message.id === ChatStorage.recivedDataMessageIsCame?.payload?.message?.id,
      );
      if (idx >= 0) {
        const [msg] = this.messageControllersV.splice(idx, 1);
        msg.component.root.remove();
      }

      this.orderMessages();
    }
  };

  private msgFromUserRecivedHandler = (): void => {
    if (
      ChatStorage.recivedData.payload &&
      ChatStorage.recivedData.payload.messages &&
      ChatStorage.recivedData.id === this.idV
    ) {
      this.messageControllersV = ChatStorage.recivedData.payload.messages.map((m) => {
        const component = new MessageComponent(m.id!);
        const controller = new MessageController(component, m);
        controller.run();
        return controller;
      });
      this.orderMessages();
    }
  };

  private orderMessages = (): void => {
    this.messageControllersV.sort((a, b) => a.message.datetime! - b.message.datetime!);
    this.updateCountUnreaded();
  };

  private userNameClickHandler = (): void => {
    this.run();
    ChatStorage.userSelected = this;
    setTimeout(() => {
      EventGenerator.generateEvent('userselected');
    }, 50);
  };
}
