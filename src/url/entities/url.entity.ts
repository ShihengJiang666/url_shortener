import { Collection } from 'fireorm';

@Collection('urls')
export class Url {
  id: string;

  originalUrl: string;

  shortCode: string;
}
