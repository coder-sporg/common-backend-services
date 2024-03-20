import {
  AfterInsert,
  AfterRemove,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';
import { Profile } from './profile.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // 保证唯一
  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  // 将 cascade: true 设置为启用完全级联操作，相关对象将被插入和更新到数据库中
  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  // @OneToMany 不能单独存在，必须与 @ManyToOne 搭配使用
  @OneToMany(() => Logs, (Logs) => Logs.user, { cascade: true }) // 第二个参数指定 反向关系 日志跟随人员的增删而增删
  logs: Logs[];

  @ManyToMany(() => Roles, (Roles) => Roles.users, { cascade: ['insert'] }) // 角色 仅跟随 用户插入而插入
  @JoinTable({ name: 'user_roles' })
  roles: Roles[];

  @AfterInsert()
  afterInsert() {
    console.log('afterInsert', this.id, this.username);
  }

  @AfterRemove()
  afterRemove() {
    console.log('Removed from the database');
  }
}
