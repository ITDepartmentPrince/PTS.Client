export class ApproveUser {
  id: number;
  auFirstName: string;
  auLastName: string;
  auJobTitle: string;

  get name() {
    return `${this.auFirstName} ${this.auLastName}`;
  }
}
