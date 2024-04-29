import './footer.scss';

export default class FooterComponent {
  private readonly rootV: HTMLElement;

  private readonly linkV: HTMLSpanElement;

  private template: string = `<div class="footer__text">
        <span>&#169;</span>
        <span id="author-link" class="interactive">Dzmitry Ryzhou</span>
        <span>2024</span>
    </div>
    <img src="../src/assets/img/rss.svg" alt="RSSchool logo" class="footer__logo">`;

  public get link(): HTMLSpanElement {
    return this.linkV;
  }

  public get root(): HTMLElement {
    return this.rootV;
  }

  constructor() {
    this.rootV = document.createElement('footer');
    this.rootV.className = 'footer main__footer';
    this.rootV.insertAdjacentHTML('afterbegin', this.template);
    this.linkV = this.rootV.querySelector('#author-link')!;
  }
}
