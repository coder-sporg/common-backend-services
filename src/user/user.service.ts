import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Logs } from '../logs/logs.entity';
import { getUserDto } from './dto/get-user.dto';
import { conditionUtils } from '../utils/db_helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
  ) {}

  findAll(@Query() query: getUserDto) {
    // SELECT * FROM user u, profile p, roles r WHERE u.id = p.uid AND u.id = r.uid AND ...
    // SELECT * FROM user u LEFT JOIN profile p ON u.id = p.uid LEFT JOIN roles r ON u.id = r.uid WHERE ...
    // LIMIT 10 OFFSET 10
    const { page, limit, username, gender, role } = query;
    const take = limit || 3;
    const skip = ((page || 1) - 1) * take;
    // 查询 user 表，关联 profile 和 roles
    // return this.userRepository.find({
    //   // 过滤数据，只需要 id 和 username，不返回 password
    //   select: {
    //     id: true,
    //     username: true,
    //     profile: {
    //       gender: true,
    //     },
    //   },
    //   relations: {
    //     profile: true,
    //     roles: true,
    //   },
    //   where: { // AND
    //     username,
    //     profile: {
    //       gender,
    //     },
    //     roles: {
    //       id: role,
    //     },
    //   },
    //   // 每页条数
    //   take,
    //   // 偏移量
    //   skip,
    // });

    const obj = {
      'user.username': username,
      'profile.gender': gender,
      'roles.id': role,
    };

    // 使用 queryBuilder 来查询
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      // LEFT JOIN 和 INNER JOIN 的区别在于，如果用户profile，INNER JOIN 不会返回该用户，而 LEFT JOIN 会返回该用户。
      // .innerJoinAndSelect('user.profile', 'profile')
      // .innerJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles');
    const newQuery = conditionUtils<User>(queryBuilder, obj);
    // 后面的条件查询需要判断是否有值
    // if (username) {
    //   queryBuilder.where('user.username = :username', { username });
    // } else {
    //   queryBuilder.where('user.username IS NOT NULL');
    // }

    // WHERE 1=1 AND ...
    // queryBuilder.where(username ? 'user.username = :username' : '1=1', {
    //   username,
    // });

    // if (gender) {
    //   queryBuilder.andWhere('profile.gender = :gender', { gender });
    // } else {
    //   queryBuilder.andWhere('profile.gender IS NOT NULL');
    // }
    // if (role) {
    //   queryBuilder.andWhere('roles.id = :role', { role });
    // } else {
    //   queryBuilder.andWhere('roles.id IS NOT NULL');
    // }
    return (
      newQuery
        // .where('user.username = :username', { username })
        // .andWhere('profile.gender = :gender', { gender })
        // .andWhere('roles.id = :role', { role })
        .take(take)
        .skip(skip)
        // getMany 和 getRawMany 的区别：getMany 会按照对象子对象返回数据，而 getRawMany 返回的是扁平化的数据（如 roles 中多条数据，也会返回多条数据）
        // .getRawMany()
        .getMany()
    );
  }

  find(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: User) {
    const newUser = await this.userRepository.create(user);
    return this.userRepository.save(newUser);

    // 捕获异常，返回给前端
    // try {
    //   const res = await this.userRepository.save(newUser);
    //   return res;
    // } catch (error) {
    //   if (error.errno === 1062) {
    //     // 抛出异常
    //     throw new HttpException(error.sqlMessage, 500);
    //   }
    // }
  }

  async update(id: number, user: Partial<User>) {
    // 查询用户详情
    const userTmp = await this.findProfile(id);
    const newUser = this.userRepository.merge(userTmp, user);
    // 联合模型更新，需要使用save方法或者queryBuilder
    return this.userRepository.save(newUser);

    // 下面的update方法，只适合单模型的更新，不适合有关系的模型更新
    // return this.userRepository.update(parseInt(id), newUser);
  }

  async remove(id: number) {
    // return this.userRepository.delete(id);
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
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
