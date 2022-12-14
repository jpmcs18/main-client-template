import { Guid } from 'guid-typescript';
export default interface ToasterMessage {
  id: Guid;
  title?: string;
  content: string;
  time: number;
  idle: boolean;
}
export interface ToasterMessageItem {
  title?: string;
  content: string;
}
