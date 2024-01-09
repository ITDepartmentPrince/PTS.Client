export class ApproveUser {
  id: number;
  auFirstName: string;
  auLastName: string;
  auJobTitle: string;
  phoneNumber: string;
  email: string;

  get name() {
    return `${this.auFirstName} ${this.auLastName}`;
  }
}
