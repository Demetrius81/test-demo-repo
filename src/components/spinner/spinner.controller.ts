import ChatStorage from 'src/utilities/storage';
import type SpinnerComponent from './spinner.component';
import Utilities from 'src/utilities/utilities';
import BaseController from '../base/base.controller';

export default class SpinnerController extends BaseController {
  private componentV: SpinnerComponent;

  constructor(component: SpinnerComponent) {
    super();
    this.componentV = component;
  }

  public override run(): void {
    this.addEventListeners();
    this.hideSpinner();
  }

  private addEventListeners = (): void => {
    document.body.addEventListener('changespinnermessage', this.changeMessageHandler);
    document.body.addEventListener('showspinner', this.showSpinner);
    document.body.addEventListener('hidespinner', this.hideSpinner);
  };

  private changeMessageHandler = (): void => {
    this.componentV.message = ChatStorage.spinnerMessage;
  };

  private showSpinner = (): void => {
    Utilities.showComponent(this.componentV.root);
  };

  private hideSpinner = (): void => {
    Utilities.hideComponent(this.componentV.root);
  };
}
