import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  // 常见的错误：在使用AdminGuard未导入UserModule => 解决办法，1. 将 userModule 设为 @Global；2. 在使用的模块中 imports 导入
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 获取请求对象
    const req = context.switchToHttp().getRequest();
    // console.log('req: ', req.user); // 通过token 可以拿到用户信息
    // 2. 获取请求中的用户信息进行逻辑上的判断 -> 角色判断
    const user = (await this.userService.find(req.user.username)) as User;
    // 普通用户 后面加入更多逻辑
    // if (user && user.roles.filter((o) => o.id === 2).length > 0) {
    //   return true;
    // }

    const isAdmin = user && user.roles.filter((o) => o.id === 1).length > 0;
    // 管理员才拥有编辑用户和删除用户的权限
    // 用户自己只有编辑的权限
    if (req.method === 'PATCH') {
      return isAdmin || user.id === parseInt(req.params.id); // 传递的参数是 string 需转换为 number
    }
    if (req.method === 'DELETE') {
      return isAdmin;
    }
    return false;
  }
}
