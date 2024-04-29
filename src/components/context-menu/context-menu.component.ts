import './context-menu.scss';

export default class ContextMenuComponent {
  private readonly rootV: HTMLElement;

  private readonly changeItemV: HTMLLIElement;

  private readonly deleteItemV: HTMLLIElement;

  public get changeItem(): HTMLLIElement {
    return this.changeItemV;
  }

  public get deleteItem(): HTMLLIElement {
    return this.deleteItemV;
  }

  public get root(): HTMLElement {
    return this.rootV;
  }

  constructor() {
    this.rootV = document.createElement('ul');
    this.rootV.className = 'context-menu dialog__context-menu';
    this.rootV.insertAdjacentHTML(
      'afterbegin',
      `<li class="context-menu__menu-item change">Change</li>
		<li class="context-menu__menu-item delete">Delete</li>`,
    );
    this.changeItemV = this.rootV.querySelector('.change')!;
    this.deleteItemV = this.rootV.querySelector('.delete')!;
  }

  public isSowing = (): boolean => {
    return !this.rootV.classList.contains('hidden');
  };
}
