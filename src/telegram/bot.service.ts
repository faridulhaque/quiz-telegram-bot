import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository, getRepository, Connection } from 'typeorm';
import { ServiceLevelLogger } from 'src/infrastructure';
const crypto = require('crypto');
import uuid4, { uuid } from 'uuidv4';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
import { Question } from 'src/schema/question.schema';

@Injectable()
export class BotService {
  @Inject('BOT_SERVICE_LEVEL_LOGGER')
  private logger: ServiceLevelLogger;
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
  ) {}

  async sendQuizToUser(telegramId: string, questionData: Question) {
    const { narration, question, answers } = questionData;
    const messageText = `${narration}\n\n${question}`;

    const buttons = Markup.inlineKeyboard(
      answers.map((answerData) =>
        Markup.button.callback(answerData.answer, String(answerData._id)),
      ),
      {
        columns: 2,
      },
    );

    console.log(telegramId);
    console.log(messageText);
    console.log(buttons);

    await this.bot.telegram.sendMessage(telegramId, messageText, buttons);
  }
}
