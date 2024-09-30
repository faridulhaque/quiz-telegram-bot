import { AppService } from './../app.service';
import { Controller } from '@nestjs/common';
import {
  Action,
  InjectBot,
  Start,
  Update,
  Ctx,
  Hears,
  Message,
  On,
  Wizard,
} from 'nestjs-telegraf';
import { Context, Scenes, session, Telegraf, Telegram } from 'telegraf';
import { BotService } from './bot.service';
import Input from 'telegraf';
import { TStart, welcomeMessage } from './telegramConstant';

@Update()
export class TelegramBotActions {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startCommand(ctx: any) {
    try {
      const user = ctx.update.message.from;
      const newUser = await this.appService.createUser(user);
      if (newUser) {
        await ctx.reply(welcomeMessage);
      }
    } catch (error) {
      console.log('error occurred', error);
    }
  }

  @Action(/.+/)
  async handleAnswer(ctx: any) {
    const selectedAnswerId = ctx.update.callback_query.data;
    const question = await this.appService.findQuestionByAnswerId(
      selectedAnswerId,
    );
    const correctAnswer = question.answers.find(
      (answer: any) => answer.isCorrect === true,
    );

  
    if (String(correctAnswer._id) === selectedAnswerId) {
      ctx.reply('You earned points');
    } else {
      ctx.reply('Your answer is incorrect');
    }
  }
}
