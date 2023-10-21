import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";

export class MeasurementUnit {
  constructor(public unitId?: number,
              public shortUnit?: string,
              public longUnit?: string,
              public inActive?: boolean,
              public createDate?: Date,
              public createUser?: CreateUser,
              public lastUpdate?: Date,
              public lastUser?: LastUser) {}
}
