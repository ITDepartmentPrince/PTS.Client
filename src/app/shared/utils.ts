import {HttpErrorResponse} from "@angular/common/http";

export class Utils {
  public static handleError(error: HttpErrorResponse): string {
    if (typeof error.error === 'object') {
      if (error.error.detail)
        return error.error.detail

      if (error.error.errors)
        return error.error.errors[Object.keys(error.error.errors)[0]]

      if (error.error.title)
        return error.error.title
    }

    if (typeof error.error === 'string' && error.status === 400)
      return error.error;

    if (typeof error.error === 'string')
      return error.message;

    return `Internal error, please contact the company's tech support.`;
  }
}
