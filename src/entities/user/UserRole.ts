import Role from './Role';

export default interface UserRole {
  id: number;
  userId: number | undefined;
  roleId: number;
  role: Role;
  deleted?: boolean | undefined;
}
