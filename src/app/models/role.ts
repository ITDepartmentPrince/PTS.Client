export class Role {
  id: number;
  name: string;
  roleType: RoleType;
}

export enum RoleType {
  Entity = 1,
  Operational = 2,
  Administrative = 3
}
