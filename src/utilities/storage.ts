import EventGenerator from 'src/services/event-generator';
import ErrorMessages from './errors';
import type IRequest from 'src/types/request';
import type IUser from 'src/types/user';
import UserController from 'src/components/user/user.controller';
import type IMessage from 'src/types/message';
import type Routes from 'src/types/routes';

export default class ChatStorage {
  public static readonly AUTHOR_PATH = 'https://github.com/Demetrius81';

  private static pathToBackV: Routes;

  private static recivedDataV: IRequest;

  private static recivedDataMessageConfirmV: IRequest;

  private static recivedDataMessageIsCameV: IRequest;

  private static userV: IUser;

  private static userSelectedV: UserController;

  private static usersOnlineV: IUser[];

  private static usersOfflineV: IUser[];

  private static spinnerMessageV: string;

  private static errorMessageV: string;

  private static topContentMenuV: number;

  private static messageToEditV: IMessage;

  private static generatedIdV: string;

  /**
   * request ID
   */
  public static get generatedId(): string {
    return ChatStorage.generatedIdV;
  }

  public static set generatedId(value: string) {
    ChatStorage.generatedIdV = value;
  }

  /**
   * Path to back if see info page
   */
  public static get pathToBack(): Routes {
    return ChatStorage.pathToBackV;
  }

  public static set pathToBack(value: Routes) {
    ChatStorage.pathToBackV = value;
  }

  /**
   * Server response when sending a message
   */
  public static get recivedDataMessageConfirm(): IRequest {
    return ChatStorage.recivedDataMessageConfirmV;
  }

  public static set recivedDataMessageConfirm(value: IRequest) {
    ChatStorage.recivedDataMessageConfirmV = value;
  }

  /**
   * Data when receiving a message
   */
  public static get recivedDataMessageIsCame(): IRequest {
    return ChatStorage.recivedDataMessageIsCameV;
  }

  public static set recivedDataMessageIsCame(value: IRequest) {
    ChatStorage.recivedDataMessageIsCameV = value;
  }

  /**
   * Message to edit or delete
   */
  public static get messageToEdit(): IMessage {
    return ChatStorage.messageToEditV;
  }

  public static set messageToEdit(value: IMessage) {
    ChatStorage.messageToEditV = value;
  }

  /**
   * Selected user for send/read messages
   */
  public static get userSelected(): UserController {
    return ChatStorage.userSelectedV;
  }

  public static set userSelected(value: UserController) {
    ChatStorage.userSelectedV = value;
  }

  /**
   * Online users
   */
  public static get usersOnline(): IUser[] {
    ChatStorage.usersOnlineV.sort((a, b) => a.login.localeCompare(b.login));
    return ChatStorage.usersOnlineV.filter((user) => user.login !== ChatStorage.userV.login);
  }

  public static set usersOnline(value: IUser[]) {
    ChatStorage.usersOnlineV = value;
    EventGenerator.generateEvent('allonlineusersrecived');
  }

  /**
   * Offline users
   */
  public static get usersOffline(): IUser[] {
    ChatStorage.usersOfflineV.sort((a, b) => a.login.localeCompare(b.login));
    return ChatStorage.usersOfflineV;
  }

  public static set usersOffline(value: IUser[]) {
    ChatStorage.usersOfflineV = value;
    EventGenerator.generateEvent('allofflineusersrecived');
  }

  /**
   * content menu top coordinates
   */
  public static get topContentMenu(): number {
    return ChatStorage.topContentMenuV;
  }

  public static set topContentMenu(value: number) {
    ChatStorage.topContentMenuV = value;
    EventGenerator.generateEvent('getboxtop');
  }

  /**
   * Error message
   */
  public static get errorMessage(): string {
    return ErrorMessages.getErrorMessages(ChatStorage.errorMessageV) ?? 'Something wrong. Unknown error.';
  }

  public static set errorMessage(value: string) {
    ChatStorage.errorMessageV = value;
    EventGenerator.generateEvent('changeerrormessage');
  }

  /**
   * Spinner message
   */
  public static get spinnerMessage(): string {
    return ChatStorage.spinnerMessageV;
  }

  public static set spinnerMessage(value: string) {
    ChatStorage.spinnerMessageV = value;
    EventGenerator.generateEvent('changespinnermessage');
  }

  /**
   * Current user
   */
  public static get user(): IUser {
    return ChatStorage.userV;
  }

  public static set user(value: IUser) {
    ChatStorage.userV = value;
  }

  /**
   * Recived data from server
   */
  public static get recivedData(): IRequest {
    return ChatStorage.recivedDataV;
  }

  public static set recivedData(value: IRequest) {
    ChatStorage.recivedDataV = value;
  }

  public static clearStorage = () => {
    this.userV = { login: '' };
    this.userSelectedV = new UserController(null, null);
  };
}
