import Utilities from 'src/utilities/utilities';
import BaseController from '../base/base.controller';
import type ContextMenuComponent from './context-menu.component';
import ChatStorage from 'src/utilities/storage';
import EventGenerator from 'src/services/event-generator';

export default class ContextMenuController extends BaseController {
  private componentV: ContextMenuComponent;

  constructor(component: ContextMenuComponent) {
    super();
    this.componentV = component;
  }

  public override run(): void {
    Utilities.hideComponent(this.componentV.root);
    this.addEventListeners();
  }

  private addEventListeners = (): void => {
    this.componentV.changeItem.addEventListener('click', this.clickChangeHandler);
    this.componentV.deleteItem.addEventListener('click', this.clickDeleteHandler);
    document.body.addEventListener('showcontextmenu', this.showContextMenuHandler);
    document.body.addEventListener('click', this.clickDocumentHandler);
  };

  private clickDocumentHandler = (): void => {
    if (this.componentV.isSowing()) {
      Utilities.hideComponent(this.componentV.root);
    }
  };

  private showContextMenuHandler = (): void => {
    this.componentV.root.style.top = `${ChatStorage.topContentMenu}px`;
    Utilities.showComponent(this.componentV.root);
  };

  private clickChangeHandler = (): void => {
    Utilities.hideComponent(this.componentV.root);
    EventGenerator.generateEvent('changemessageclick');
  };

  private clickDeleteHandler = (): void => {
    Utilities.hideComponent(this.componentV.root);
    EventGenerator.generateEvent('deletemessageclick');
  };
}
