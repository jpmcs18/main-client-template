import Access from './Access';

export default interface Role {
  id: number;
  description: string;
  accesses: Access[];
}
