import { Action } from './action.model';

export class ActionEvent<T> {
  action: string;
  object: T;
  index: number;
}
