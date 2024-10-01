import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Question, QuestionDocument } from './schema/question.schema';
import { EnvironmentConfigService, ServiceLevelLogger } from './infrastructure';
import { User, UserDocument } from './schema/user.schema';
import { SavedAnswer, SavedAnswersDocument } from './schema/savedAnswer.schema';

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
    @InjectModel(SavedAnswer.name)
    private savedAnswerModel: Model<SavedAnswersDocument>,
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

  async getUserByTGId(tgId: string): Promise<User> {
    try {
      const user = await this.userModel.findOne().select({
        telegramId: tgId,
      });
      return user;
    } catch (error) {
      this.logger.error('Error while fetching user');
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
      this.logger.error('Error fetching question by answer ID:', error);
      return null;
    }
  }

  async checkIfAlreadyAnswered(
    questionId: mongoose.Schema.Types.ObjectId,
  ): Promise<boolean> {
    const data = await this.savedAnswerModel.findOne({
      questionId: questionId,
    });
    return data ? true : false;
  }

  async saveAnswer(data: Partial<SavedAnswer>): Promise<SavedAnswer> {
    try {
      const newAnswer = new this.savedAnswerModel(data);
      const savedAnswer = await newAnswer.save();
      return savedAnswer;
    } catch (error) {
      this.logger.error('Error while saving an answer');
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPoints(id: mongoose.Schema.Types.ObjectId): Promise<number> {
    const result = await this.savedAnswerModel.aggregate([
      { $match: { userId: id } },
      { $group: { _id: null, totalPoints: { $sum: '$points' } } },
    ]);

    return result.length > 0 ? result[0].totalPoints : 0;
  }
}
