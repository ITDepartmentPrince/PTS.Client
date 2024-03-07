import {Injectable} from "@angular/core";
import {Operations} from "../shared/operations";
import {RolesConstant} from "./roles-constant";

@Injectable({providedIn: 'root'})
export class AuthPolicy {
  public static canUserRead(role: string) {
    return {
      action: Operations.View,
      role: role
    }
  }

  public static canUserCreate(role: string) {
    return {
      action: Operations.Create,
      role: role
    }
  }

  public static canUserEdit(role: string) {
    return {
      action: Operations.Edit,
      role: role
    }
  }

  public static canUserDelete(role: string) {
    return {
      action: Operations.Delete,
      role: role
    }
  }

  public static canUserApprovePr() {
    return {
      role: RolesConstant.PRApprover
    }
  }

  public static canUserApprovePo() {
    return {
      role: RolesConstant.POApprover
    }
  }

  public static canUserExecApprovePo() {
    return {
      role: RolesConstant.ExecutiveApprover
    }
  }

  public static canUserRegisterNewUser() {
    return {
      role: RolesConstant.RegisterNewUser
    }
  }
}
