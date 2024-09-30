import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './schema/question.schema';
import { EnvironmentConfigService, ServiceLevelLogger } from './infrastructure';
import { User, UserDocument } from './schema/user.schema';
import { Context, Markup, Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';

type TBotUser = {
  first_name: string;
  last_name: string;
  id: string;
  username?: string;
};

@Injectable()
export class AppService {
  @Inject('APP_SERVICE_LOGGER')
  private logger: ServiceLevelLogger;
  constructor(
    @InjectModel(Question.name)
    private questionModel: Model<QuestionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly environmentConfigService: EnvironmentConfigService,
  ) {}

  async createUser(user: TBotUser): Promise<User> {
    try {
      const isUserExisted = await this.userModel.findOne({
        telegramId: user.id,
      });
      if (isUserExisted) {
        this.logger.log('User already exists');
        return isUserExisted;
      } else {
        this.logger.log('New user is being created');

        const newUser = new this.userModel({
          telegramId: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
        });
        const savedUser = await newUser.save();
        this.logger.log('New user has been created');

        return savedUser;
      }
    } catch (error) {
      this.logger.error(`Failed to fetch or create user ${error}`);
    }
  }

  async createQuestion(question: Question): Promise<Question> {
    try {
      this.logger.log('Trying to create a question');
      const newQuestion = new this.questionModel(question);
      const savedQuestion = await newQuestion.save();
      this.logger.log('New question has been created');
      return savedQuestion;
    } catch (error) {
      this.logger.error('Error creating question', error);
      throw new HttpException(
        'Question creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUsersTGIds(): Promise<any> {
    try {
      this.logger.log('Trying to get users telegram Ids');
      const usersWithTGIds = await this.userModel.find().select({
        _id: 1,
        telegramId: 1,
      });
      return usersWithTGIds;
    } catch (error) {
      this.logger.error('Error getting users telegram Ids', error);
    }
  }

  async findQuestionByAnswerId(
    selectedAnswerId: string,
  ): Promise<Question | null> {
    try {
      const question = await this.questionModel
        .findOne({
          'answers._id': selectedAnswerId,
        })
        .exec();

      return question;
    } catch (error) {
      console.error('Error fetching question by answer ID:', error);
      return null;
    }
  }
}
