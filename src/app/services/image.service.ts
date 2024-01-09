import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {map, take} from "rxjs";

@Injectable({providedIn: "root"})
export class ImageService {
  constructor(private http: HttpClient) { }

  toBase64(url: string) {
    return this.http.get(url, {
      observe: 'body',
      responseType: 'arraybuffer',
    })
      .pipe(
        take(1),
        map((arrayBuffer) =>
          btoa(
            Array.from(new Uint8Array(arrayBuffer))
              .map((b) => String.fromCharCode(b))
              .join('')
          )
        ),
      )
  }

  imageToDataUri(url: string) {
    return this.toBase64(url)
      .pipe(
        map(value => {
          return `data:image/${url.split('.').pop()};base64,${value}`
        })
      );
  }
}
