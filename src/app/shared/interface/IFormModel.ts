import {Operations} from "../operations";

export interface IFormModel<T> {
  action: Operations;
  model:T
}
