import type IMessage from './message';
import type IUser from './user';

type Payload = {
  error: string;
  user: IUser;
  users: IUser[];
  message: IMessage;
  messages: IMessage[];
};

export default Payload;
