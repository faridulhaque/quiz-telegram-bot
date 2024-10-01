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
import { SavedAnswer } from 'src/schema/savedAnswer.schema';

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
    const client = ctx.update.callback_query.from;

    const selectedAnswerId = ctx.update.callback_query.data;

    const question = await this.appService.findQuestionByAnswerId(
      selectedAnswerId,
    );

    const isAnswered = await this.appService.checkIfAlreadyAnswered(
      question._id,
    );

    if (isAnswered) {
      ctx.reply('You answered this question already');
    } else {
      const user = await this.appService.getUserByTGId(client.id);
      const points = await this.appService.getPoints(user._id);

      const correctAnswer = question.answers.find(
        (answer: any) => answer.isCorrect === true,
      );

      const data: Partial<SavedAnswer> = {
        questionId: question._id,
        selectedAnswerId,
        userId: user._id,
      };

      if (String(correctAnswer._id) === selectedAnswerId) {
        await this.appService.saveAnswer({
          ...data,
          receivedPoints: question.points,
        });
        const points = await this.appService.getPoints(user._id);
        console.log(points);
        await ctx.reply(`You earned ${question.points} points`);
      } else {
        await this.appService.saveAnswer({
          ...data,
          receivedPoints: question.points,
        });
        await ctx.reply('Your answer is incorrect');
      }
    }
  }
}
