import type IRequest from 'src/types/request';
import Handler from './base.handler';
import RequestMode from 'src/types/request-type';
import ChatStorage from 'src/utilities/storage';
import EventGenerator from '../event-generator';

export default class MsgEditHandler extends Handler {
  private readonly REQUEST_TYPE: RequestMode = RequestMode.msgEdit;

  protected readonly next: Handler | null;

  constructor(handler: Handler | null) {
    super();
    this.next = handler;
  }

  public override handle(request: IRequest): void {
    if (request.type === this.REQUEST_TYPE) {
      if (request.payload && request.payload.message) {
        ChatStorage.recivedData = request;
        EventGenerator.generateEvent('messageeditrecived');
      } else {
        throw new Error(`Something wrong with server.`);
      }
    } else {
      this.next?.handle(request);
    }
  }
}
