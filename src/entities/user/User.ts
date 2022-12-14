import Personnel from '../transaction/Personnel';
import UserRole from './UserRole';

export default interface User {
  id: number;
  username: string;
  name: string;
  active: boolean;
  admin: boolean;
  personnel?: Personnel | undefined;
  personnelId?: number | undefined;
  userRoles?: UserRole[] | undefined;
}
