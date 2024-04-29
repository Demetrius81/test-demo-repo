import type IStatusMsg from './status-message';

interface IMessage {
  id?: string;
  from?: string;
  to?: string;
  text?: string;
  datetime?: number;
  status?: Partial<IStatusMsg>;
}

export default IMessage;
