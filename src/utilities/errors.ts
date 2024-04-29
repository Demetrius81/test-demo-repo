export default class ErrorMessages {
  private static readonly errorMessages: Map<string, string> = new Map([
    ['a user with this login is already authorized', 'A user with this login is already authorized'],
    ['incorrect password', 'Incorrect password'],
    ['there is no user with this login', 'There is no user with this login'],
    ['the user was not authorized', 'The user was not authorized'],
    ['sender and recipient logins are the same', 'Sender and recipient logins are the same'],
    ['the user with the specified login does not exist', 'The user with the specified login does not exist'],
    ['user not registered or not logged', 'User not registered or not logged'],
    ['incorrect message id', 'Incorrect message id'],
    ['user not recipient cannot be executed', 'User not recipient cannot be executed'],
    ['incorrect request structure', 'Incorrect request structure'],
    ['incorrect type parameters', 'Incorrect type parameters'],
    ['incorrect payload parameters', 'Incorrect payload parameters'],
    ['internal server error', 'Internal server error'],
  ]);

  public static getErrorMessages(error: string): string | undefined {
    return this.errorMessages.get(error);
  }
}
