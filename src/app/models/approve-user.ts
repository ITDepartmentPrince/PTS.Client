export class ApproveUser {
  public name = '';

  constructor(public id: number,
              public auFirstName: string,
              public auLastName: string,
              public auJobTitle: string,) {
    this.name = `${this.auFirstName} ${this.auLastName}`;
  }
}
