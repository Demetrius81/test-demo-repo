import Utilities from 'src/utilities/utilities';
import type MainComponent from './main.component';
import BaseController from '../base/base.controller';
import HeaderComponent from '../header/header.component';
import HeaderController from '../header/header.controller';
import FooterComponent from '../footer/footer.component';
import FooterController from '../footer/footer.controller';
import ContentComponent from '../content/content.component';
import ContentController from '../content/content.controller';
import EventGenerator from 'src/services/event-generator';
import Routes from 'src/types/routes';
import Router from 'src/router/router';

export default class MainController extends BaseController {
  private componentV: MainComponent;

  private headerV: HeaderComponent;

  private headerControllerV: HeaderController;

  private footerV: FooterComponent;

  private footerControllerV: FooterController;

  private contentV: ContentComponent;

  private contentControllerV: ContentController;

  constructor(component: MainComponent) {
    super();
    this.componentV = component;
    this.headerV = new HeaderComponent();
    this.contentV = new ContentComponent();
    this.footerV = new FooterComponent();
    this.headerControllerV = new HeaderController(this.headerV);
    this.footerControllerV = new FooterController(this.footerV);
    this.contentControllerV = new ContentController(this.contentV);
  }

  public override run(): void {
    this.addEventListeners();
    Utilities.hideComponent(this.componentV.root);
    this.componentV.root.append(this.headerV.root, this.contentV.root, this.footerV.root);
    this.headerControllerV.run();
    this.footerControllerV.run();
    this.contentControllerV.run();
  }

  private addEventListeners = (): void => {
    document.body.addEventListener('userlogin', this.userLoginHandler);
    document.body.addEventListener('userlogout', MainController.userLogoutHandler);
    document.body.addEventListener('movetologin', this.routeToLoginHandler);
    document.body.addEventListener('movetomain', this.routeToChatHandler);
    document.body.addEventListener('movetoabout', this.routeToAboutHandler);
  };

  private routeToLoginHandler = (): void => {
    Utilities.hideComponent(this.componentV.root);
  };

  private routeToChatHandler = (): void => {
    Utilities.showComponent(this.componentV.root);
  };

  private routeToAboutHandler = (): void => {
    Utilities.hideComponent(this.componentV.root);
  };

  private userLoginHandler = (): void => {
    this.headerControllerV.run();
    this.footerControllerV.run();
    this.contentControllerV.run();
    setTimeout(() => {
      EventGenerator.generateEvent('hidespinner');
      Router.route(Routes.chat);
    }, 0);
  };

  private static userLogoutHandler = (): void => {
    Router.route(Routes.login);
  };
}
