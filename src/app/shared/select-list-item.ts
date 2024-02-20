import {RoleType} from "../models/role";

export class SelectListItem {
  public text: string;
  public value: string;
  public disabled = false;
  public selected = false;
  public create = false;
  public read = false;
  public update = false;
  public delete = false;
  roleType: RoleType;
}
