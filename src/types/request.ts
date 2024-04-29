import type Payload from './payload';
import type RequestMode from './request-type';

interface IRequest {
  id: string | null;
  type: RequestMode;
  payload: Partial<Payload> | null;
}

export default IRequest;
