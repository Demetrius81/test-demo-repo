import './info.scss';

export default class InfoComponent {
  private readonly rootV: HTMLDivElement;

  private readonly backBtnV: HTMLButtonElement;

  private readonly linkV: HTMLAnchorElement;

  private template: string = `<div class="info__box">
        <h3 class="info__header">Fun Chat</h3>
        <div class="info__about">The application was developed as part of the Fun Chat training task of the RSSchool JavaScript/Front-end 2023Q4 course</div>
        <a class="info__link" href="https://github.com/Demetrius81">Author Demetrius81</a>
        <button type="button" class="info__button button enabled">Back</button>
    </div>`;

  public get link(): HTMLAnchorElement {
    return this.linkV;
  }

  public get backBtn(): HTMLButtonElement {
    return this.backBtnV;
  }

  public get root(): HTMLDivElement {
    return this.rootV;
  }

  constructor() {
    this.rootV = document.createElement('div');
    this.rootV.className = 'info';
    this.rootV.insertAdjacentHTML('afterbegin', this.template);
    this.backBtnV = this.rootV.querySelector('.info__button')!;
    this.linkV = this.rootV.querySelector('.info__link')!;
  }
}
