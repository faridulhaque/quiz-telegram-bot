import { EnvironmentConfigService } from './infrastructure/environment-config/environment-config.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Question } from './schema/question.schema';
import { BotService } from './telegram/bot.service';
import { AdminAuthGuard } from './guards/adminAuthGuard';

@Controller('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly botService: BotService,
  ) {}

  @Get()
  testApp(): string {
    return 'Hello World!';
  }

  @Post('/create-question')
  @UseGuards(AdminAuthGuard)
  async createQuestion(@Body() body: Question): Promise<Question> {
    const questionData = await this.appService.createQuestion(body);
    if (questionData) {
      const userData = await this.appService.getUsersTGIds();

      if (!userData.length) {
        throw new HttpException('There is no users', HttpStatus.NOT_FOUND);
      }

      const sendMessages = userData.map((user: any) =>
        this.botService.sendQuizToUser(user.telegramId, questionData),
      );

      try {
        await Promise.all(sendMessages);
      } catch (error) {
        throw new HttpException(
          'Question was not sent to the users',
          HttpStatus.BAD_GATEWAY,
        );
      }
    }

    return questionData;
  }
}
