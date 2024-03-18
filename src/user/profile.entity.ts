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

  @OneToOne(() => User, { onDelete: 'CASCADE' }) // 指定目标关系类型为 User 跟随用户的删除而删除，没有使用 cascade 是防止循环引用
  // 默认是 userId，通过name修改，@JoinColumn必须仅在关系的一侧设置 - 必须在数据库表中具有外键的一侧
  @JoinColumn({ name: 'uid' })
  user: User;
}
