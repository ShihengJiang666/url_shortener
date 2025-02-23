import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalUrl: string;

  @Column()
  shortCode: string;
}
