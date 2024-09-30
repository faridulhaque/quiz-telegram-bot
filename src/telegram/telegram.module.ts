import { Module } from '@nestjs/common';
import {
  EnvironmentConfigModule,
  EnvironmentConfigService,
  ServiceLevelLogger,
} from 'src/infrastructure';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotService } from './bot.service';
import { AppService } from 'src/app.service';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: (configService: EnvironmentConfigService) => ({
        token: configService.getTelegramApiToken(),
      }),
    }),
  ],
  controllers: [],
  providers: [
    BotService,

    {
      provide: 'BOT_SERVICE_LEVEL_LOGGER',
      useValue: new ServiceLevelLogger('BOT_SERVICE_LEVEL_LOGGER'),
    },
  ],
  exports: [BotService],
})
export class TelegramModule {}
