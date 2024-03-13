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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // 保证唯一
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  // @OneToMany 不能单独存在，必须与 @ManyToOne 搭配使用
  @OneToMany(() => Logs, (Logs) => Logs.user) // 第二个参数指定 反向关系
  logs: Logs[];

  @ManyToMany(() => Roles, (Roles) => Roles.users)
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
