import ChatStorage from 'src/utilities/storage';
import BaseController from '../base/base.controller';
import ContextMenuComponent from '../context-menu/context-menu.component';
import ContextMenuController from '../context-menu/context-menu.controller';
import DelimiterComponent from '../delimiter/delimiter.component';
import DelimiterController from '../delimiter/delimiter.controller';
import MessageComponent from '../message/message.component';
import MessageController from '../message/message.controller';
import type DialogComponent from './dialog.component';
import { UserStatus } from 'src/types/status';
import WebSocketService from 'src/services/websocket.service';
import Utilities from 'src/utilities/utilities';
import EventGenerator from 'src/services/event-generator';

export default class DialogController extends BaseController {
  private componentV: DialogComponent;

  private contextMenuV: ContextMenuComponent;

  private contextMenuControllerV: ContextMenuController;

  private messageControllersV: MessageController[];

  private newMessageControllersV: MessageController[];

  private delimiterV: DelimiterComponent;

  private delimiterControllerV: DelimiterController;

  private webserviceV: WebSocketService;

  private isEditModeV: boolean = false;

  constructor(component: DialogComponent) {
    super();
    this.componentV = component;
    this.contextMenuV = new ContextMenuComponent();
    this.delimiterV = new DelimiterComponent();
    this.webserviceV = WebSocketService.Instance;
    this.messageControllersV = [];
    this.newMessageControllersV = [];
    this.delimiterControllerV = new DelimiterController(this.delimiterV);
    this.contextMenuControllerV = new ContextMenuController(this.contextMenuV);
  }

  public override run(): void {
    this.componentV.messages.textContent = 'Start chatting';
    Utilities.disableElement(this.componentV.messageInput, this.componentV.sendButton);
    this.componentV.editCancel.classList.add('dialog__cancel_hidden');
    this.componentV.setSelectedUser('Select a user from the list', undefined);
    this.contextMenuControllerV.run();
    this.delimiterControllerV.run();
    this.addEventListeners();
  }

  private runControllers = (): void => {
    this.messageControllersV.forEach((mc) => mc.run());
    this.newMessageControllersV.forEach((mc) => mc.run());
  };

  private renderMessages = (): void => {
    if (this.messageControllersV.length === 0 && this.newMessageControllersV.length === 0) {
      this.componentV.messages.innerHTML = '';
      this.componentV.messages.textContent = 'Write your first message';
      return;
    }
    if (this.newMessageControllersV.length > 0) {
      EventGenerator.generateEvent('showdelimiter');
    } else {
      EventGenerator.generateEvent('hidedelimiter');
    }

    this.componentV.messages.innerHTML = '';
    this.componentV.messages.append(
      this.contextMenuV.root,
      ...this.messageControllersV.map((m) => m.component.root),
      this.delimiterV.root,
      ...this.newMessageControllersV.map((m) => m.component.root),
    );
  };

  private addEventListeners = (): void => {
    this.componentV.messageForm.addEventListener('submit', (e: SubmitEvent) => e.preventDefault());
    this.componentV.messageInput.addEventListener('input', this.inputEventHandler);
    document.body.addEventListener('userselected', this.userSelectedHandler);
    document.body.addEventListener('messagesendconfirm', this.messageIsSendedHandler);
    document.body.addEventListener('addmessagetolist', this.messageIsaddedHandler);
    document.body.addEventListener('changemessageclick', this.clickChangeMessageHandler);
    document.body.addEventListener('deletemessageclick', this.clickDeleteMessageHandler);
    document.body.addEventListener('messagedeleteconfirm', this.messageDeleteHandler);
    document.body.addEventListener('messagereadedconfirm', this.changeReadStatusHandler);
    this.componentV.root.addEventListener('mouseover', this.addChangeReadStatusEventListeners);
    this.componentV.root.addEventListener('mouseout', this.removeChangeReadStatusEventListeners);
  };

  private addChangeReadStatusEventListeners = (): void => {
    this.componentV.messages.addEventListener('click', this.tryChangeReadStatusHandler);
    this.componentV.messages.addEventListener('scroll', this.tryChangeReadStatusHandler);
    this.componentV.sendButton.addEventListener('click', this.tryChangeReadStatusHandler);
  };

  private removeChangeReadStatusEventListeners = (): void => {
    this.componentV.messages.removeEventListener('click', this.tryChangeReadStatusHandler);
    this.componentV.messages.removeEventListener('scroll', this.tryChangeReadStatusHandler);
    this.componentV.sendButton.removeEventListener('click', this.tryChangeReadStatusHandler);
  };

  private tryChangeReadStatusHandler = (): void => {
    this.newMessageControllersV.forEach((mc) => {
      if (mc.message.id) {
        mc.setId(Utilities.generateUUID());
        this.webserviceV.changeReadStatus(mc.id, mc.message.id);
      }
    });
    EventGenerator.generateEvent('updatecountstatus');
  };

  private changeReadStatusHandler = (): void => {
    const idx = this.newMessageControllersV.findIndex((mc) => mc.id === ChatStorage.recivedDataMessageConfirm.id);
    const [controller] = this.newMessageControllersV.splice(idx, 1);

    this.messageControllersV.push(controller);
    this.renderMessages();
  };

  private messageDeleteHandler = (): void => {
    if (ChatStorage.recivedDataMessageConfirm?.payload?.message?.id) {
      let idx = this.messageControllersV.findIndex(
        (mc) => mc.message.id === ChatStorage.recivedDataMessageConfirm?.payload?.message?.id,
      );
      if (idx >= 0) {
        this.messageControllersV.splice(idx, 1)[0].component.root.remove();
      } else {
        idx = this.newMessageControllersV.findIndex(
          (mc) => mc.message.id === ChatStorage.recivedDataMessageConfirm?.payload?.message?.id,
        );
        if (idx > 0) {
          this.newMessageControllersV.splice(idx, 1);
        }
      }
    }
  };

  private clickChangeMessageHandler = (): void => {
    this.isEditModeV = true;
    Utilities.enableElement(this.componentV.messageInput);
    this.componentV.editCancel.classList.remove('dialog__cancel_hidden');
    this.componentV.editCancel.addEventListener('click', this.clickCancelEditHandler);
  };

  private clickDeleteMessageHandler = (): void => {
    if (ChatStorage.messageToEdit.id) {
      ChatStorage.generatedId = Utilities.generateUUID();
      this.webserviceV.deleteMessage(ChatStorage.generatedId, ChatStorage.messageToEdit.id);
    }
  };

  private messageIsaddedHandler = (): void => {
    if (
      !ChatStorage.recivedDataMessageIsCame.id &&
      ChatStorage.recivedDataMessageIsCame.payload?.message?.id &&
      ChatStorage.user.login === ChatStorage.recivedDataMessageIsCame?.payload?.message?.to &&
      ChatStorage.userSelected.user.login === ChatStorage.recivedDataMessageIsCame?.payload?.message?.from
    ) {
      if (this.messageControllersV.length === 0 && this.newMessageControllersV.length === 0) {
        this.componentV.messages.innerHTML = '';
        this.componentV.messages.append(this.contextMenuV.root, this.delimiterV.root);
      }

      const component = new MessageComponent(ChatStorage.recivedDataMessageIsCame?.payload?.message?.id);
      const controller = new MessageController(component, ChatStorage.recivedDataMessageIsCame.payload.message);
      controller.run();
      this.newMessageControllersV.push(controller);
      this.renderMessages();
      ChatStorage.recivedDataMessageIsCame.payload = null;
    }
  };

  private messageIsSendedHandler = (): void => {
    if (
      ChatStorage.recivedDataMessageConfirm.id &&
      ChatStorage.recivedDataMessageConfirm.payload &&
      ChatStorage.recivedDataMessageConfirm.payload.message &&
      ChatStorage.recivedDataMessageConfirm.payload.message.id &&
      ChatStorage.userSelected.user.login === ChatStorage.recivedDataMessageConfirm?.payload?.message?.to
    ) {
      if (this.messageControllersV.length === 0 && this.newMessageControllersV.length === 0) {
        this.componentV.messages.innerHTML = '';
        this.componentV.messages.append(this.contextMenuV.root, this.delimiterV.root);
      }

      const component = new MessageComponent(ChatStorage.recivedDataMessageConfirm.payload.message.id);
      const controller = new MessageController(component, ChatStorage.recivedDataMessageConfirm.payload.message);
      controller.run();
      this.messageControllersV.push(controller);
      this.delimiterV.root.before(component.root);
      EventGenerator.generateEvent('scrolltodelimiter');
      ChatStorage.recivedDataMessageConfirm.payload = null;
    }
  };

  private userSelectedHandler = (): void => {
    this.componentV.setSelectedUser(
      ChatStorage.userSelected.user.login,
      ChatStorage.userSelected.user.isLogined ? UserStatus.online : UserStatus.offline,
    );
    this.setUpHistoryMessages();
    Utilities.enableElement(this.componentV.messageInput);
  };

  private setUpHistoryMessages = (): void => {
    if (!ChatStorage.userSelected) {
      return;
    }

    this.clearMessages();
    this.createMsgControllersAndComponents();
    this.runControllers();
    this.renderMessages();
  };

  private createMsgControllersAndComponents = (): void => {
    if (!ChatStorage.userSelected) {
      return;
    }

    this.messageControllersV = ChatStorage.userSelected.messageControllers
      .filter((msc) => msc.message.status?.isReaded || msc.message.from === ChatStorage.user.login)
      .sort((a, b) => a.message.datetime! - b.message.datetime!);

    this.newMessageControllersV = ChatStorage.userSelected.messageControllers
      .filter((msc) => !msc.message.status?.isReaded && msc.message.from !== ChatStorage.user.login)
      .sort((a, b) => a.message.datetime! - b.message.datetime!);
  };

  private clearMessages = (): void => {
    this.messageControllersV = [];
    this.newMessageControllersV = [];
  };

  private clickCancelEditHandler = (): void => {
    this.isEditModeV = false;
    this.componentV.messageInput.value = '';
    this.componentV.editCancel.classList.add('dialog__cancel_hidden');
    Utilities.disableElement(this.componentV.sendButton);
    this.componentV.editCancel.removeEventListener('click', this.clickCancelEditHandler);
    this.componentV.messageForm.removeEventListener('submit', this.submitEventHandler);
  };

  private submitEventHandler = (): void => {
    if (this.isEditModeV) {
      if (ChatStorage.messageToEdit.id) {
        this.webserviceV.editMessage(
          Utilities.generateUUID(),
          ChatStorage.messageToEdit.id,
          this.componentV.messageInput.value,
        );
      }
      this.clickCancelEditHandler();
    } else {
      this.webserviceV.sendMessage(ChatStorage.userSelected.user.login, this.componentV.messageInput.value);
      this.clickCancelEditHandler();
    }
  };

  private inputEventHandler = (e: Event): void => {
    const text = (<HTMLInputElement>e.target).value;
    if (text.length > 0) {
      Utilities.enableElement(this.componentV.sendButton);
      this.componentV.messageForm.addEventListener('submit', this.submitEventHandler);
    } else {
      Utilities.disableElement(this.componentV.sendButton);
      this.componentV.messageForm.removeEventListener('submit', this.submitEventHandler);
    }
  };
}
