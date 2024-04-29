import type IRequest from 'src/types/request';

export default abstract class Handler {
  public abstract handle(request: IRequest): void;
}
