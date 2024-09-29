import { Module } from '@nestjs/common';
import {
  EnvironmentConfigModule,
  EnvironmentConfigService,
  ServiceLevelLogger,
} from 'src/infrastructure';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotService } from './bot.service';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: (config: EnvironmentConfigService) => ({
        token: config.getTelegramApiToken(),
      }),
    }),
  ],
  controllers: [],
  providers: [
    EnvironmentConfigService,
    BotService,

    {
      provide: 'BOT_SERVICE_LEVEL_LOGGER',
      useValue: new ServiceLevelLogger('BOT_SERVICE_LEVEL_LOGGER'),
    },
    {
      provide: 'IMAGE_PROCESSOR_LOGGER',
      useValue: new ServiceLevelLogger('IMAGE_PROCESSOR_LOGGER'),
    },
    {
      provide: 'BILL_IMAGE_PROCESSOR_LOGGER',
      useValue: new ServiceLevelLogger('BILL_IMAGE_PROCESSOR_LOGGER'),
    },
  ],
  exports: [BotService],
})
export class TelegramModule {}
