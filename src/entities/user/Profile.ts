import Personnel from '../transaction/Personnel';
import Module from './Module';

export default interface Profile {
  username?: string | undefined;
  admin?: boolean | undefined;
  personnelId?: number | undefined;
  personnel?: Personnel | undefined;
  distinctModules?: Module[] | undefined;
}
