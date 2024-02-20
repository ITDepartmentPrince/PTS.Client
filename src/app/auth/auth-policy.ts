import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class AuthPolicy {
  public static canUserRead() {
    return ['Admin', 'Read'];
  }

  public static canUserCreate() {
    return ['Admin', 'Create'];
  }

  public static canUserEdit() {
    return ['Admin', 'Edit'];
  }

  public static canUserDelete() {
    return ['Admin', 'Delete'];
  }

  public static canUserApprovePr() {
    return ['Admin', 'PRApprover'];
  }

  public static canUserApprovePo() {
    return ['Admin', 'POApprover'];
  }

  public static canUserExecApprovePo() {
    return ['Admin', 'ExecutiveApprover'];
  }

  public static canUserRegisterNewUser() {
    return ['Admin', 'RegisterNewUser'];
  }
}
