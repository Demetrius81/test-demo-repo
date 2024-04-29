import type IRequest from 'src/types/request';
import Handler from './base.handler';
import RequestMode from 'src/types/request-type';
import ChatStorage from 'src/utilities/storage';
import EventGenerator from '../event-generator';

export default class MsgSendHandler extends Handler {
  private readonly REQUEST_TYPE: RequestMode = RequestMode.msgSend;

  protected readonly next: Handler | null;

  constructor(handler: Handler | null) {
    super();
    this.next = handler;
  }

  public override handle(request: IRequest): void {
    if (request.type === this.REQUEST_TYPE) {
      if (request.payload && request.payload.message) {
        if (request.id) {
          ChatStorage.recivedDataMessageConfirm = request;
          EventGenerator.generateEvent('messagesendconfirm');
        } else {
          ChatStorage.recivedDataMessageIsCame = request;
          EventGenerator.generateEvent('messageiscame');
        }
      } else {
        throw new Error(`Something wrong with server.`);
      }
    } else {
      this.next?.handle(request);
    }
  }
}
