import BaseController from '../base/base.controller';
import ContactsComponent from '../contacts/contacts.component';
import ContactsController from '../contacts/contacts.controller';
import DialogComponent from '../dialog/dialog.component';
import DialogController from '../dialog/dialog.controller';
import type ContentComponent from './content.component';

export default class ContentController extends BaseController {
  private componentV: ContentComponent;

  private contactsV: ContactsComponent;

  private contactsControllerV: ContactsController;

  private dialogV: DialogComponent;

  private dialogControllerV: DialogController;

  constructor(component: ContentComponent) {
    super();
    this.componentV = component;
    this.contactsV = new ContactsComponent();
    this.dialogV = new DialogComponent();
    this.contactsControllerV = new ContactsController(this.contactsV);
    this.dialogControllerV = new DialogController(this.dialogV);
  }

  public override run(): void {
    this.componentV.root.append(this.contactsV.root, this.dialogV.root);
    this.contactsControllerV.run();
    this.dialogControllerV.run();
  }
}
