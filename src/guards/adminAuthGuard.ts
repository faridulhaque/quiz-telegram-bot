import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EnvironmentConfigService } from 'src/infrastructure';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly environmentConfigService: EnvironmentConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const reqAdminSecret = request.headers['admin-secret'];

      const adminSecret = this.environmentConfigService.getAdminSecret();

      if (reqAdminSecret !== adminSecret) {
        throw new HttpException(
          'Invalid Admin Secret',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        return true;
      }
    } catch (error) {
      throw new HttpException('Verification failed', HttpStatus.UNAUTHORIZED);
    }
  }
}
