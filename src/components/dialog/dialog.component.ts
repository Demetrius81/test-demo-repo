import { UserStatus } from 'src/types/status';
import './dialog.scss';

export default class DialogComponent {
  private readonly rootV: HTMLElement;

  private readonly messagesV: HTMLElement;

  private readonly messageFormV: HTMLFormElement;

  private readonly messageInputV: HTMLInputElement;

  private readonly editCancelV: HTMLSpanElement;

  private readonly userSelectedNameV: HTMLSpanElement;

  private readonly userSelectedStatusV: HTMLSpanElement;

  private readonly sendButtonV: HTMLButtonElement;

  public get sendButton(): HTMLButtonElement {
    return this.sendButtonV;
  }

  public get messageForm(): HTMLFormElement {
    return this.messageFormV;
  }

  public get messageInput(): HTMLInputElement {
    return this.messageInputV;
  }

  public get editCancel(): HTMLSpanElement {
    return this.editCancelV;
  }

  public get messages(): HTMLElement {
    return this.messagesV;
  }

  public get root(): HTMLElement {
    return this.rootV;
  }

  constructor() {
    this.rootV = document.createElement('article');
    this.rootV.className = 'content__dialog dialog';
    this.rootV.insertAdjacentHTML(
      'afterbegin',
      `<article class="dialog__header">
				<span class="dialog__user-name">SomeUser</span>
				<span class="dialog__user-status offline">offline</span>
		</article>
		<article class="dialog__messages">				
		</article>
		<form class="dialog__input-box">
				<input
						id="dialog-input"
						class="dialog__input text-input"
						placeholder="Message..."
						value=""
				>
				<span class="dialog__cancel">X</span>
				<button type="submit" class="dialog__input-button button enabled">Send</button>
		</form>`,
    );
    this.messagesV = this.rootV.querySelector('.dialog__messages')!;
    this.messageFormV = this.rootV.querySelector('.dialog__input-box')!;
    this.messageInputV = this.rootV.querySelector('#dialog-input')!;
    this.editCancelV = this.rootV.querySelector('.dialog__cancel')!;
    this.userSelectedNameV = this.rootV.querySelector('.dialog__user-name')!;
    this.userSelectedStatusV = this.rootV.querySelector('.dialog__user-status')!;
    this.sendButtonV = this.rootV.querySelector('.dialog__input-button')!;
  }

  public setSelectedUser = (user: string, status: UserStatus = UserStatus.offline): void => {
    this.userSelectedNameV.textContent = user;
    this.userSelectedStatusV.textContent = status;
    if (status === UserStatus.online) {
      this.userSelectedStatusV.classList.remove('offline');
    } else {
      this.userSelectedStatusV.classList.add('offline');
    }
  };
}
