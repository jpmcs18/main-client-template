import Personnel from '../transaction/Personnel';

export default interface UpdateUserProfile {
  username: string;
  personnel?: Personnel | undefined;
  password?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}
