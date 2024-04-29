import EventGenerator from 'src/services/event-generator';
import Routes from 'src/types/routes';

export default class Router {
  public static route = (loc: Routes): void => {
    switch (loc) {
      case Routes.chat:
        window.location.hash = '#/chat/';
        EventGenerator.generateEvent('movetomain');

        break;
      case Routes.login:
        window.location.hash = '#/login/';
        EventGenerator.generateEvent('movetologin');

        break;
      case Routes.info:
        window.location.hash = '#/about/';
        EventGenerator.generateEvent('movetoabout');

        break;
      default:
        break;
    }
  };

  public static run = (): void => {
    window.addEventListener('load', () => {
      const loc = <Routes>window.location.hash;
      if (loc) {
        Router.route(loc);
      }
    });

    if (window.location.hash.length === 0 && !sessionStorage.getItem('user')) {
      Router.route(Routes.login);
    } else if (window.location.hash.length === 0 && sessionStorage.getItem('user')) {
      Router.route(Routes.chat);
    }
  };
}
