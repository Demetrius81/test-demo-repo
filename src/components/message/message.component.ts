import './message.scss';
import type IStatusMsg from 'src/types/status-message';

export default class MessageComponent {
  private readonly rootV: HTMLElement;

  private senderV: HTMLSpanElement;

  private dateV: HTMLSpanElement;

  private textV: HTMLDivElement;

  private statusV: HTMLSpanElement;

  private iseditedV: HTMLSpanElement;

  private readonly idV: string;

  private template: string = `<div class="message__box">
        <div class="message__header">
            <span class="message__sender">SenderName</span>
            <span class="message__date">01.01.1970, 12:20:20</span>
        </div>
        <div class="message__text">TextMessage</div>
        <div class="message__footer">
            <span class="message__ststus">edited</span>
            <span class="message__isedited">readed</span>
        </div>
    </div>`;

  public get id(): string {
    return this.idV;
  }

  public get root(): HTMLElement {
    return this.rootV;
  }

  constructor(id: string) {
    this.idV = id;
    this.rootV = document.createElement('div');
    this.rootV.className = 'message';
    this.rootV.insertAdjacentHTML('afterbegin', this.template);
    this.rootV.dataset.time = '123123123';
    this.rootV.dataset.status = 'delivered';
    this.rootV.dataset.id = id;
    this.senderV = this.rootV.querySelector('.message__sender')!;
    this.dateV = this.rootV.querySelector('.message__date')!;
    this.textV = this.rootV.querySelector('.message__text')!;
    this.statusV = this.rootV.querySelector('.message__ststus')!;
    this.iseditedV = this.rootV.querySelector('.message__isedited')!;
  }

  public setDataTime = (value: number | undefined): void => {
    if (!value) {
      throw new Error('Wrong data!');
    }

    this.dateV.textContent = MessageComponent.formatDate(new Date(value));
    this.rootV.dataset.time = value.toString();
  };

  public getDataTime = (): number => {
    return +this.rootV.dataset.time!;
  };

  public setRecivedStatus = (value: Partial<IStatusMsg> | undefined): void => {
    this.iseditedV.textContent = '';
    this.statusV.textContent = '';
    this.rootV.dataset.status = value?.isDelivered ? 'delivered' : '';
  };

  public setSendingStatus = (value: Partial<IStatusMsg> | undefined): void => {
    if (!value) {
      throw new Error('Wrong data!');
    }

    this.iseditedV.textContent = value.isEdited ? 'edited' : '';

    switch (true) {
      case !value.isDelivered && !value.isReaded:
        this.rootV.dataset.status = 'sended';
        this.statusV.textContent = 'sended';
        break;
      case value.isDelivered && !value.isReaded:
        this.rootV.dataset.status = 'delivered';
        this.statusV.textContent = 'delivered';
        break;
      case value.isDelivered && value.isReaded:
        this.rootV.dataset.status = 'readed';
        this.statusV.textContent = 'readed';
        break;

      default:
        break;
    }
  };

  public getStatus = (): IStatusMsg => {
    return {
      isDelivered: this.statusV.textContent! === ('delivered' || 'readed'),
      isReaded: this.statusV.textContent! === 'readed',
      isEdited: this.iseditedV.textContent === 'edited',
      isDeleted: false,
    };
  };

  public setSender = (value: string | undefined): void => {
    if (!value) {
      throw new Error('Wrong data!');
    }

    this.senderV.textContent = value;
  };

  public isTransmitted = (): boolean => {
    return this.rootV.classList.contains('message_transmitted');
  };

  public setTransmitted = (): void => {
    this.rootV.classList.add('message_transmitted');
  };

  private static formatDate = (date: Date): string => {
    const day: string = date.getDate().toString().padStart(2, '0');
    const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
    const year: number = date.getFullYear();
    const hours: string = date.getHours().toString().padStart(2, '0');
    const minutes: string = date.getMinutes().toString().padStart(2, '0');
    const seconds: string = date.getSeconds().toString().padStart(2, '0');

    return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
  };

  public setText = (value: string | undefined): void => {
    if (!value) {
      throw new Error('Wrong data!');
    }

    this.textV.textContent = value;
  };
}
