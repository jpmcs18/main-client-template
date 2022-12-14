import Module from './Module';

export default interface Access {
  id: number;
  roleId: number;
  moduleId: number;
  module?: Module | undefined;
  checked: boolean | false;
}
