import {SelectListItem} from "../shared/select-list-item";
import {UserRole} from "./user-role";

export class User {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  imageFile: string;
  imageDataUri: string | null;
  userName: string;
  email: string;
  phoneNumber: string;
  fullName = "";
  userRoles: UserRole[] = [];
  roles = new Array<SelectListItem>();
}
