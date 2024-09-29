import { AppService } from './../app.service';
import { UserService } from './../services/user.service';
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
import { TStart, welcomeMessage, yesNoButtons } from './telegramConstant';

@Update()
export class TelegramBotActions {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly botService: BotService,
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Start()
  async startCommand(ctx: any) {
    try {
      const user = ctx.update.message.from;
      const newUser = await this.userService.createUser(user);
      if (newUser) {
        await ctx.reply(welcomeMessage, yesNoButtons);
      }
    } catch (error) {
      console.log('error occurred', error);
    }
  }

  @Action(TStart.n)
  async handleNegReply(@Ctx() ctx: Context) {
    await ctx.reply('Ok! Let me know when you are in the mood!');
  }

  @Action(TStart.y)
  async handlePosReply(@Ctx() ctx: Context) {
    const narration = await this.appService.getNarration();
    await ctx.reply(narration.narration);
  }
}
