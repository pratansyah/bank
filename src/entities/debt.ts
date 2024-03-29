import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn,
} from 'typeorm';
import User from './user';

@Entity()
export default class Debt {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  debtor: User;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  creditor: User;

  @Column('float', { precision: 50, scale: 2, default: 0 })
  amount: number;

  @CreateDateColumn({
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
