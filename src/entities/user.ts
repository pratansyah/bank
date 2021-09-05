import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column('float', { precision: 50, scale: 2, default: 0 })
  balance: number;

  @CreateDateColumn({
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
