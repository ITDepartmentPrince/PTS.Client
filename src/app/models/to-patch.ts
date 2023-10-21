export class ToPatch {
  constructor(public op: string,
              public path: string,
              public value: string) {
    this.path = '/' + this.path;
  }
}
