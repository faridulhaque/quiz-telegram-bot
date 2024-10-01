import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import {
  EnvironmentConfigModule,
  EnvironmentConfigService,
  ServiceLevelLogger,
} from './infrastructure';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { TelegramBotActions } from './telegram/telegramActions';
import { Question, QuestionSchema } from './schema/question.schema';
import { BotService } from './telegram/bot.service';
import { SavedAnswer, SavedAnswerSchema } from './schema/savedAnswer.schema';

@Module({
  imports: [
    EnvironmentConfigModule,
    MongooseModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      useFactory: async (configService: EnvironmentConfigService) => ({
        uri: configService.getDbConnectionUrl(),
      }),
      inject: [EnvironmentConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: SavedAnswer.name, schema: SavedAnswerSchema },
    ]),

    TelegramModule,
    EnvironmentConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TelegramBotActions,
    BotService,
    {
      provide: 'APP_SERVICE_LOGGER',
      useValue: new ServiceLevelLogger('APP_SERVICE_LOGGER'),
    },
    {
      provide: 'BOT_SERVICE_LEVEL_LOGGER',
      useValue: new ServiceLevelLogger('BOT_SERVICE_LEVEL_LOGGER'),
    },
  ],
})
export class AppModule {}
