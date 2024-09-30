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
import { AnsweredQuestionsByUser } from 'src/schema/answeredQuestionsByUser.schema';

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

    const isAnswered = await this.appService.checkIfAlreadyAnswered(
      question._id,
    );

    if (isAnswered) {
      return ctx.reply('You answered this question already');
    }
    const correctAnswer = question.answers.find(
      (answer: any) => answer.isCorrect === true,
    );

    if (String(correctAnswer._id) === selectedAnswerId) {
      const data: Partial<AnsweredQuestionsByUser> = {
        questionId: question._id,
        selectedAnswerId,
        receivedPoints: question.points,
      };
      await this.appService.saveAnswer(data)
      await ctx.reply('You earned points');
    } else {
      await ctx.reply('Your answer is incorrect');
    }
  }
}
