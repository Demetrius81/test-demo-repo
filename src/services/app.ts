import AppComponent from 'src/app/app.component';
import ErrorComponent from 'src/components/error/error.component';
import ErrorController from 'src/components/error/error.controller';
import LoginComponent from 'src/components/login/login.component';
import LoginController from 'src/components/login/login.controller';
import MainComponent from 'src/components/main/main.component';
import MainController from 'src/components/main/main.controller';
import SpinnerComponent from 'src/components/spinner/spinner.component';
import SpinnerController from 'src/components/spinner/spinner.controller';
import EventGenerator from './event-generator';
import Router from 'src/router/router';
import InfoComponent from 'src/components/info/info.component';
import InfoController from 'src/components/info/info.controller';

export default class Application {
  private appV: AppComponent;

  private loginV: LoginComponent;

  private loginControllerV: LoginController;

  private spinnerV: SpinnerComponent;

  private spinnerControllerV: SpinnerController;

  private errorV: ErrorComponent;

  private errorControllerV: ErrorController;

  private mainV: MainComponent;

  private mainControllerV: MainController;

  private infoV: InfoComponent;

  private infoControllerV: InfoController;

  public get login(): LoginComponent {
    return this.loginV;
  }

  public get main(): MainComponent {
    return this.mainV;
  }

  public get spinnerController(): SpinnerController {
    return this.spinnerControllerV;
  }

  public get logincontroller(): LoginController {
    return this.loginControllerV;
  }

  constructor() {
    this.appV = new AppComponent();
    this.loginV = new LoginComponent();
    this.spinnerV = new SpinnerComponent();
    this.errorV = new ErrorComponent();
    this.mainV = new MainComponent();
    this.infoV = new InfoComponent();
    this.loginControllerV = new LoginController(this.loginV);
    this.spinnerControllerV = new SpinnerController(this.spinnerV);
    this.errorControllerV = new ErrorController(this.errorV);
    this.mainControllerV = new MainController(this.mainV);
    this.infoControllerV = new InfoController(this.infoV);
  }

  run(): void {
    this.appV.root.append(this.spinnerV.root, this.errorV.root, this.loginV.root, this.mainV.root, this.infoV.root);
    document.body.append(this.appV.root);
    this.loginControllerV.run();
    this.spinnerControllerV.run();
    this.errorControllerV.run();
    this.mainControllerV.run();
    this.infoControllerV.run();
    Application.addEventListeners();
    Router.run();
  }

  private static addEventListeners = () => {
    document.body.addEventListener('connectionclose', Application.connectionCloseHandler);
    document.body.addEventListener('connectionopen', Application.connectionOpenHandler);
  };

  private static connectionOpenHandler = (): void => {
    EventGenerator.generateEvent('hidespinner');
  };

  private static connectionCloseHandler = (): void => {
    EventGenerator.generateEvent('showspinner');
  };
}
