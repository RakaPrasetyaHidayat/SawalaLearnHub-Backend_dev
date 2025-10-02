import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../common/enums';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req && req.user;

    if (!user) {
      // No authenticated user on request — explicit 401
      throw new UnauthorizedException('Authentication required');
    }

    const userRole = (user && (user.role || user?.data?.role));
    if (!userRole) {
      throw new UnauthorizedException('User role not found');
    }

    const allowed = requiredRoles.some((role) => String(userRole).toUpperCase() === String(role).toUpperCase());
    if (!allowed) throw new ForbiddenException('Forbidden resource');
    return true;
  }
}
