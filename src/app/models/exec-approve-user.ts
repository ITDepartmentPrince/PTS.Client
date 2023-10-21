export class ExecApproveUser {
  public name = '';

  constructor(public id: number,
              public eauFirstName: string,
              public eauLastName: string,
              public eauJobTitle: string,) {
    this.name = `${this.eauFirstName} ${this.eauLastName}`;
  }
}
