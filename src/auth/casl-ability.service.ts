import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  ExtractSubjectType,
  createMongoAbility,
} from '@casl/ability';
import { UserService } from '../user/user.service';
import { getEntities } from '../utils/common';
import { Menus } from '../menus/menus.entity';

@Injectable()
export class CaslAbilityService {
  constructor(private userService: UserService) {}
  // 针对于整个系统的 -> 可以 其他命名 createUser XX SYStem
  async forRoot(username: string) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    // can('manage', 'all'); // all是 CASL 的关键词，代表任何对象 manage 权限 高于 其他(CRUD)
    // menu 名称、路径、acl ->actions -> 名称、路径->实体对应
    // path -> prefix -> 写死在项目代码里 路径

    // 其他思路：acl -> 表来进行存储 -> LogController + Action
    // log -> sys:log -> sys:log:read, sys:log:write ...
    // can('read', Logs);
    // cannot('update', Logs);

    const user = await this.userService.find(username);
    // user -> 1:n roles -> 1:n menus -> 去重 {}

    const obj = {} as Record<string, unknown>;
    user.roles.forEach((o) => {
      o.menus.forEach((menu) => {
        // path -> acl -> actions
        // 通过Id去重
        obj[menu.id] = menu;
      });
    });
    const menus = Object.values(obj) as Menus[];

    menus.forEach((menu) => {
      // path acl
      const actions = menu.acl.split(',');
      for (const action of actions) {
        can(action, getEntities(menu.path));
      }
    });

    const ability = build({
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<any>,
    });

    // ability.can()
    // @CheckPolicies((ability) => ability.cannot(Action, User, [''])) // 写一个 装饰器，来方便操作

    return ability;
  }
}
