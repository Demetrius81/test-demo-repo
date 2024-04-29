import ChatStorage from 'src/utilities/storage';
import type ErrorComponent from './error.component';
import EventGenerator from 'src/services/event-generator';
import Utilities from 'src/utilities/utilities';
import BaseController from '../base/base.controller';

export default class ErrorController extends BaseController {
  private componentV: ErrorComponent;

  constructor(component: ErrorComponent) {
    super();
    this.componentV = component;
  }

  public override run(): void {
    this.addEventListeners();
    this.hideError();
  }

  private addEventListeners = (): void => {
    document.body.addEventListener('changeerrormessage', this.changeMessageHandler);
    document.body.addEventListener('showerror', this.showError);
    this.componentV.okBtn.addEventListener('click', this.hideError);
  };

  private changeMessageHandler = (): void => {
    this.componentV.message.textContent = ChatStorage.errorMessage;
    EventGenerator.generateEvent('hidespinner');
    this.showError();
  };

  private showError = (): void => {
    Utilities.showComponent(this.componentV.root);
  };

  private hideError = (): void => {
    Utilities.hideComponent(this.componentV.root);
  };
}
