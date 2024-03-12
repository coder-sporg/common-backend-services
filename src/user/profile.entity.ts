import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  gender: number;
  @Column()
  photo: string;
  @Column()
  address: string;

  @OneToOne(() => User) // 指定目标关系类型为 User
  // 默认是 userId，通过name修改，@JoinColumn必须仅在关系的一侧设置 - 必须在数据库表中具有外键的一侧
  @JoinColumn({ name: 'uid' })
  user: User;
}
