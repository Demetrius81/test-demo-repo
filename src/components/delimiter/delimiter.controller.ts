import Utilities from 'src/utilities/utilities';
import BaseController from '../base/base.controller';
import type DelimiterComponent from './delimiter.component';

export default class DelimiterController extends BaseController {
  private componentV: DelimiterComponent;

  constructor(component: DelimiterComponent) {
    super();
    this.componentV = component;
  }

  public override run(): void {
    Utilities.hideComponent(this.componentV.root);
    document.body.addEventListener('showdelimiter', this.showDelimiterHandler);
    document.body.addEventListener('hidedelimiter', this.hideDelimiterHandler);
    document.body.addEventListener('scrolltodelimiter', this.scrollToDelimiterHandler);
  }

  private showDelimiterHandler = (): void => {
    Utilities.showComponent(this.componentV.root);
    this.scrollToDelimiterHandler();
  };

  private hideDelimiterHandler = (): void => {
    Utilities.hideComponent(this.componentV.root);
  };

  private scrollToDelimiterHandler = (): void => {
    this.componentV.root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
}
