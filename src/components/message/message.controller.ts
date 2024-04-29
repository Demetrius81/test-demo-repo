import type IMessage from 'src/types/message';
import BaseController from '../base/base.controller';
import type MessageComponent from './message.component';
import ChatStorage from 'src/utilities/storage';
import EventGenerator from 'src/services/event-generator';
import type IStatusMsg from 'src/types/status-message';

export default class MessageController extends BaseController {
  private componentV: MessageComponent;

  private messageV: IMessage;

  private idV: string = '';

  public get component(): MessageComponent {
    return this.componentV;
  }

  public get id(): string {
    return this.idV;
  }

  public set id(value: string) {
    this.idV = value;
  }

  public get message(): IMessage {
    return this.messageV;
  }

  constructor(component: MessageComponent, msg: IMessage) {
    super();
    this.componentV = component;
    this.messageV = msg;
  }

  public override run(): void {
    this.addEventListeners();
    if (!this.messageV.datetime || !this.messageV.from || !this.messageV.status || !this.messageV.text) {
      return;
    }
    if (this.messageV.from === ChatStorage.user.login) {
      this.componentV.setTransmitted();
      this.componentV.setSender('you');
      this.componentV.setSendingStatus(this.messageV.status);
    } else {
      this.componentV.setSender(this.messageV.from);
      this.componentV.setRecivedStatus(this.messageV.status);
    }
    this.componentV.setDataTime(this.messageV.datetime);
    this.componentV.setText(this.messageV.text);
  }

  public setId = (id: string): void => {
    this.idV = id;
  };

  public setStatus = (status: Partial<IStatusMsg> | undefined): void => {
    if (!status) {
      return;
    }

    if (!this.messageV.status) {
      this.messageV.status = {};
    }

    this.messageV.status.isReaded = status.isReaded;
    this.componentV.setSendingStatus(status);
  };

  private addEventListeners = (): void => {
    this.componentV.root.addEventListener('contextmenu', this.clickContextMenuHandler);
    document.body.addEventListener('messageeditrecived', this.messageEditHandler);
    document.body.addEventListener('messagedeliver', this.messageDeliverHandler);
    document.body.addEventListener('messagereaded', this.messageReadedHandler);
    document.body.addEventListener('', () => {});
    document.body.addEventListener('', () => {});
  };

  private messageReadedHandler = (): void => {
    if (
      this.messageV.id === ChatStorage.recivedDataMessageIsCame.payload?.message?.id &&
      ChatStorage.recivedDataMessageIsCame.payload?.message?.status?.isReaded
    ) {
      if (!this.messageV.status) {
        this.messageV.status = {};
      }

      this.messageV.status.isReaded = ChatStorage.recivedDataMessageIsCame.payload?.message?.status?.isReaded;
      if (this.messageV.from === ChatStorage.user.login) {
        this.componentV.setSendingStatus(this.messageV.status);
      } else {
        this.componentV.setRecivedStatus(this.messageV.status);
      }
    }
  };

  private messageDeliverHandler = (): void => {
    if (
      this.messageV.id === ChatStorage.recivedData.payload?.message?.id &&
      ChatStorage.recivedData.payload?.message?.status?.isDelivered
    ) {
      if (!this.messageV.status) {
        this.messageV.status = {};
      }

      this.messageV.status.isDelivered = ChatStorage.recivedData.payload?.message?.status?.isDelivered;

      if (this.messageV.from === ChatStorage.user.login) {
        this.componentV.setSendingStatus(this.messageV.status);
      } else {
        this.componentV.setRecivedStatus(this.messageV.status);
      }
    }
  };

  private messageEditHandler = (): void => {
    if (
      this.messageV.id === ChatStorage.recivedData.payload?.message?.id &&
      ChatStorage.recivedData.payload?.message?.status?.isEdited &&
      ChatStorage.recivedData.payload?.message?.text
    ) {
      this.messageV.text = ChatStorage.recivedData.payload?.message?.text;

      if (!this.messageV.status) {
        this.messageV.status = {};
      }

      this.messageV.status.isEdited = ChatStorage.recivedData.payload?.message?.status?.isEdited;

      if (this.messageV.from === ChatStorage.user.login) {
        this.componentV.setSendingStatus(this.messageV.status);
      } else {
        this.componentV.setRecivedStatus(this.messageV.status);
      }

      this.componentV.setText(this.messageV.text);
    }
  };

  private clickContextMenuHandler = (e: MouseEvent): void => {
    if (this.componentV.isTransmitted()) {
      ChatStorage.topContentMenu = e.clientY;
      e.preventDefault();
      ChatStorage.messageToEdit = this.messageV;
      EventGenerator.generateEvent('showcontextmenu');
    }
  };
}
