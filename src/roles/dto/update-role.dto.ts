import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';

// PartialType => 类似于 TS 的 Partial
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
