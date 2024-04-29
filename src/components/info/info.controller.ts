import Utilities from 'src/utilities/utilities';
import type InfoComponent from './info.component';
import BaseController from '../base/base.controller';
import ChatStorage from 'src/utilities/storage';
import Router from 'src/router/router';

export default class InfoController extends BaseController {
  private componentV: InfoComponent;

  constructor(component: InfoComponent) {
    super();
    this.componentV = component;
  }

  public override run(): void {
    this.addEventListeners();
    Utilities.hideComponent(this.componentV.root);
  }

  private addEventListeners = (): void => {
    this.componentV.backBtn.addEventListener('click', InfoController.clickBackHandler);
    this.componentV.link.addEventListener('click', InfoController.clickLinkHandler);
    document.body.addEventListener('movetologin', this.routeToLoginHandler);
    document.body.addEventListener('movetomain', this.routeToChatHandler);
    document.body.addEventListener('movetoabout', this.routeToAboutHandler);
  };

  private static clickLinkHandler = (e: MouseEvent): void => {
    e.preventDefault();
    window.open(ChatStorage.AUTHOR_PATH, '_blank');
  };

  private routeToLoginHandler = (): void => {
    Utilities.hideComponent(this.componentV.root);
  };

  private routeToChatHandler = (): void => {
    Utilities.hideComponent(this.componentV.root);
  };

  private routeToAboutHandler = (): void => {
    Utilities.showComponent(this.componentV.root);
  };

  private static clickBackHandler = (): void => {
    Router.route(ChatStorage.pathToBack);
  };
}
