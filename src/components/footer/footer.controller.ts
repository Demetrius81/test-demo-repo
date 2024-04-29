import Utilities from 'src/utilities/utilities';
import type FooterComponent from './footer.component';
import BaseController from '../base/base.controller';
import ChatStorage from 'src/utilities/storage';

export default class FooterController extends BaseController {
  private componentV: FooterComponent;

  constructor(component: FooterComponent) {
    super();
    this.componentV = component;
  }

  public override run(): void {
    this.addEventListeners();
  }

  private addEventListeners = (): void => {
    this.componentV.link.addEventListener('click', () => {
      window.open(ChatStorage.AUTHOR_PATH, '_blank');
    });
  };

  public showMain = (): void => {
    Utilities.showComponent(this.componentV.root);
  };

  public hideMain = (): void => {
    Utilities.hideComponent(this.componentV.root);
  };
}
