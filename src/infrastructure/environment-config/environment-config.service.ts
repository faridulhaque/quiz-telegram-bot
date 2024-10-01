import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfigService {
  constructor(private readonly configService: ConfigService) {}

  getTelegramApiToken() {
    return this.configService.get<string>('TELEGRAM_TOKEN');
  }

  getDbConnectionUrl() {
    return this.configService.get<string>('DB_CONNECTION_URL');
  }
  getAdminSecret() {
    return this.configService.get<string>('ADMIN_SECRET');
  }
}
