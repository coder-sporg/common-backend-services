import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';
import { Role } from '../enum/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector, // 可以访问加在 controller 上面的注解信息
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // jwt -> userId -> user -> roles

    // getAllAndOverride 进行覆盖: 路由 会 覆盖类 => roles.controller getAll 会 覆盖 class
    // getAllAndMerge 合并: 将路由和类 进行合并 成 数组 [ 2, 1 ]
    const requiredRoles = this.reflector.getAllAndMerge<Role[]>(ROLES_KEY, [
      context.getHandler(), // 路由
      context.getClass(), // 类
    ]);
    // console.log('requiredRoles: ', requiredRoles);

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    // user -> roles -> menu -> CURD + M, C1,C2,C3
    // 较优的方案：写一个装饰器，通过角色获取菜单，根据菜单的 cal 来进行授权
    const user = await this.userService.find(req.user.username);
    // 当前用户的角色
    const roleIds = user.roles.map((role) => role.id);

    // 判断用户的角色是否在 需要的角色中
    const flag = requiredRoles.some((role) => roleIds.includes(role));

    return flag;
  }
}
