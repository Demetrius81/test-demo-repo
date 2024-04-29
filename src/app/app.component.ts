import './style.scss';
import './_default.scss';
import './_font.scss';
import './_button.scss';
import './_input.scss';
import './_scroll.scss';

export default class AppComponent {
  private rootV: HTMLDivElement;

  public get root(): HTMLDivElement {
    return this.rootV;
  }

  constructor() {
    this.rootV = document.createElement('div');
    this.rootV.id = 'app';
  }
}
