import {SelectListItem} from "../shared/select-list-item";

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
  roles = new Array<SelectListItem>();
}
