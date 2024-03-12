import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Logs } from '../logs/logs.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  find(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async create(user: User) {
    const newUser = await this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  delete(id: number) {
    return this.userRepository.delete(id);
  }

  findProfile(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });
  }

  // 一对多
  async findUserLogs(id: number): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id } });
    return this.logsRepository.find({
      // 多对多关系中，对应的 User 实体
      where: { user },
      // 携带用户的数据
      relations: {
        user: true,
      },
    });
  }

  findLogsByGroup(id: number) {
    // SELECT logs.result, COUNT(logs.result) FROM logs, user WHERE logs.userId = user.id AND user.id = 3 GROUP BY logs.result;
    // SELECT `logs`.`result` AS `result`, `user`.`id` AS `user_id`, `user`.`username` AS `user_username`, `user`.`password` AS `user_password`, COUNT(`logs`.`result`) AS `count` FROM `logs` `logs` LEFT JOIN `user` `user` ON `user`.`id`=`logs`.`userId` WHERE `logs`.`userId` = ? GROUP BY `logs`.`result`
    // return this.logsRepository.query(
    //   `SELECT logs.result, COUNT(logs.result) AS count FROM logs, user WHERE logs.userId = user.id AND user.id = ${id} GROUP BY logs.result`,
    // );
    return (
      this.logsRepository
        .createQueryBuilder('logs') // 查询 logs 表
        .select('logs.result', 'result') // 起别名
        .addSelect('COUNT(logs.result)', 'count') // 总数
        .leftJoinAndSelect('logs.user', 'user')
        .where('logs.userId = :id', { id })
        .groupBy('logs.result') // 根据 result 分组
        .orderBy('count', 'DESC')
        .addOrderBy('result', 'DESC') // 追加倒序排列
        // .offset(2)
        .limit(3)
        .getRawMany()
    );
  }
}
