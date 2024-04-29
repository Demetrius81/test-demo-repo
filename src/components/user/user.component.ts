import Utilities from 'src/utilities/utilities';
import './user.scss';
import { UserStatus } from 'src/types/status';

export default class UserComponent {
  private readonly rootV: HTMLElement;

  private readonly userNameV: HTMLSpanElement;

  private readonly msgCountV: HTMLSpanElement;

  private template: string = `<span class="user__name interactive">PanRaman</span>
    <span class="user__msg-count">5</span>`;

  public get userName(): HTMLSpanElement {
    return this.userNameV;
  }

  public get msgCount(): HTMLSpanElement {
    return this.msgCountV;
  }

  public get root(): HTMLElement {
    return this.rootV;
  }

  constructor() {
    this.rootV = document.createElement('li');
    this.rootV.className = 'user';
    this.rootV.insertAdjacentHTML('afterbegin', this.template);
    this.rootV.dataset.id = '';
    this.rootV.dataset.status = 'online';
    this.userNameV = this.rootV.querySelector('.user__name')!;
    this.msgCountV = this.rootV.querySelector('.user__msg-count')!;
  }

  public setDataId = (id: string): void => {
    this.rootV.dataset.id = id;
  };

  public getDataId = (): string => {
    return this.rootV.dataset.id!;
  };

  public setDataStatus = (status: UserStatus): void => {
    this.rootV.dataset.status = status;
    this.userNameV.classList.add('interactive');
    if (status === UserStatus.online) {
      this.userNameV.classList.remove('offline');
      this.userNameV.classList.add('online');
    } else {
      this.userNameV.classList.remove('online');
      this.userNameV.classList.add('offline');
    }
  };

  public getDataStatus = (): string => {
    return this.rootV.dataset.status!;
  };

  public setUserName = (userName: string): void => {
    this.userNameV.textContent = userName;
  };

  public setMsgCount = (msgCount: number): void => {
    if (msgCount === 0) {
      Utilities.hideComponent(this.msgCountV);
    } else {
      Utilities.showComponent(this.msgCountV);
    }

    this.msgCountV.textContent = msgCount.toString();
  };
}
