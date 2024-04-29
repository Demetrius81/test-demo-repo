import type IRequest from 'src/types/request';
import ChatStorage from 'src/utilities/storage';
import EventGenerator from './event-generator';
import RequestMode from 'src/types/request-type';
import Utilities from 'src/utilities/utilities';
import type IUser from 'src/types/user';
import type IMessage from 'src/types/message';
import type Handler from './request_handlers/base.handler';
import ErrorHandler from './request_handlers/error.handler';
import MsgDeleteHandler from './request_handlers/msgdelete.handler';
import MsgDeliverHandler from './request_handlers/msgdeliver.handler';
import MsgEditHandler from './request_handlers/msgedit.handler';
import MsgFromUserHandler from './request_handlers/msgfromuser.handler';
import MsgReadHandler from './request_handlers/msgread.handler';
import MsgSendHandler from './request_handlers/msgsend.handler';
import UserActiveHandler from './request_handlers/useractive.handler';
import UserExtLoginHandler from './request_handlers/userextlogin.handler';
import UserExtLogoutHandler from './request_handlers/userextlogout.handler.ts.handler';
import UserInactiveHandler from './request_handlers/userinactive.handler';
import UserLoginHandler from './request_handlers/userlogin.handler';
import UserLogoutHandler from './request_handlers/userlogout.handler';
import Service from './service';

export default class WebSocketService extends Service {
  private connectionV: WebSocket;

  private static instance: Service;

  private readonly handlersChain: Handler;

  public static get Instance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }

    return <WebSocketService>WebSocketService.instance;
  }

  public get connection(): WebSocket {
    return this.connectionV;
  }

  private constructor() {
    super();
    this.handlersChain = new ErrorHandler(
      new MsgDeleteHandler(
        new MsgDeliverHandler(
          new MsgEditHandler(
            new MsgFromUserHandler(
              new MsgReadHandler(
                new MsgSendHandler(
                  new UserActiveHandler(
                    new UserExtLoginHandler(
                      new UserExtLogoutHandler(
                        new UserInactiveHandler(new UserLoginHandler(new UserLogoutHandler(null))),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
    this.connectionV = new WebSocket('ws://localhost:4000');
    this.getconnection();
  }

  private addEventHandlers = (): void => {
    this.connectionV.onopen = () => {
      EventGenerator.generateEvent('connectionopen');
    };

    this.connectionV.onerror = () => {
      this.getconnection();
    };

    this.connectionV.onclose = () => {
      ChatStorage.spinnerMessage = 'Waiting for connection to server...';
      EventGenerator.generateEvent('connectionclose');
      this.getconnection();
    };

    this.connectionV.onmessage = (e: MessageEvent<string>) => {
      if (e) {
        const request: IRequest = <IRequest>JSON.parse(e.data);
        this.handlersChain.handle(request);
      }
    };
  };

  private getconnection = (): void => {
    if (this.connectionV.readyState > 1) {
      this.connectionV = new WebSocket('ws://localhost:4000');
      if (this.connectionV.readyState !== 1) {
        setTimeout(() => {
          this.getconnection();
        }, 100);
      }
    }
    this.addEventHandlers();
  };

  public getMessageHistory = (user: string, id: string): void => {
    const request: IRequest = {
      id,
      type: RequestMode.msgFromUser,
      payload: {
        user: {
          login: user,
        },
      },
    };

    this.connectionV.send(JSON.stringify(request));
  };

  public getUsersOnline = (): void =>
    this.connectionV.send(JSON.stringify(WebSocketService.createUsersRequest(RequestMode.userActive)));

  public getUsersOffline = (): void =>
    this.connectionV.send(JSON.stringify(WebSocketService.createUsersRequest(RequestMode.userInactive)));

  private static createUsersRequest = (type: RequestMode): IRequest => ({
    id: Utilities.generateUUID(),
    type,
    payload: null,
  });

  public sendMessage = (user: string, text: string): void => {
    const msg: IMessage = {
      to: user,
      text,
    };
    const request: IRequest = {
      id: Utilities.generateUUID(),
      type: RequestMode.msgSend,
      payload: {
        message: msg,
      },
    };

    this.connectionV.send(JSON.stringify(request));
  };

  public changeReadStatus = (requestId: string, msgId: string): void =>
    this.connectionV.send(
      JSON.stringify(WebSocketService.createMessageChangeStatusRequest(requestId, msgId, RequestMode.msgRead)),
    );

  public deleteMessage = (requestId: string, msgId: string): void =>
    this.connectionV.send(
      JSON.stringify(WebSocketService.createMessageChangeStatusRequest(requestId, msgId, RequestMode.msgDelete)),
    );

  public editMessage = (requestId: string, msgId: string, text: string): void =>
    this.connectionV.send(
      JSON.stringify(WebSocketService.createMessageChangeStatusRequest(requestId, msgId, RequestMode.msgEdit, text)),
    );

  private static createMessageChangeStatusRequest = (
    requestId: string,
    messageId: string,
    type: RequestMode,
    text?: string,
  ): IRequest => ({
    id: requestId,
    type,
    payload: {
      message: {
        id: messageId,
        text,
      },
    },
  });

  public loginUser = (user: IUser): void => {
    const requestString = JSON.stringify(WebSocketService.createUserOperationRequest(user, RequestMode.userLogin));
    this.connectionV.send(requestString);
  };

  private static createUserOperationRequest = (user: IUser, type: RequestMode): IRequest => ({
    id: Utilities.generateUUID(),
    type,
    payload: {
      user,
    },
  });

  public logoutUser = (user: IUser): void => {
    const requestString = JSON.stringify(WebSocketService.createUserOperationRequest(user, RequestMode.userLogout));
    this.connectionV.send(requestString);
  };
}
