import './contacts.scss';

export default class ContactsComponent {
  private readonly rootV: HTMLElement;

  private readonly findInputV: HTMLInputElement;

  private readonly usersListV: HTMLUListElement;

  public get findInput(): HTMLInputElement {
    return this.findInputV;
  }

  public get usersList(): HTMLUListElement {
    return this.usersListV;
  }

  public get root(): HTMLElement {
    return this.rootV;
  }

  constructor() {
    this.rootV = document.createElement('aside');
    this.rootV.className = 'content__contacts contacts';
    this.rootV.insertAdjacentHTML(
      'afterbegin',
      `<input class="contacts__input text-input" placeholder="Find ->">
			<ul class="contacts__users">
			</ul>`,
    );
    this.findInputV = this.rootV.querySelector('.contacts__input')!;
    this.usersListV = this.rootV.querySelector('.contacts__users')!;
  }
}
