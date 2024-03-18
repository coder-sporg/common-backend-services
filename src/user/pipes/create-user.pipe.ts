import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
// 自定义管道 校验用户角色传入的类型为 id[]
export class CreateUserPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    // value 为请求数据的参数 metadata 为当前处理的方法参数的元数据 https://docs.nestjs.cn/10/pipes?id=%e8%87%aa%e5%ae%9a%e4%b9%89%e7%ae%a1%e9%81%93
    if (value.roles && Array.isArray(value.roles) && value.roles.length > 0) {
      if (value.roles[0]['id']) {
        value.roles = value.roles.map((role) => role.id);
      }
    }
    // 返回值才是真正传给服务端的数据，如果替换 可以与前端传递的无关
    return value;
  }
}
