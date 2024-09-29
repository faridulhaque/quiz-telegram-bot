import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Narration, NarrationDocument } from './schema/narration.schema';
import { Question, QuestionDocument } from './schema/question.schema';
import { ServiceLevelLogger } from './infrastructure';

@Injectable()
export class AppService {
  @Inject('APP_SERVICE_LOGGER')
  private logger: ServiceLevelLogger;
  constructor(
    @InjectModel(Narration.name)
    private narrationModel: Model<NarrationDocument>,
    @InjectModel(Question.name)
    private questionModel: Model<QuestionDocument>,
  ) {}

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

  async createNarration(narration: Narration): Promise<Narration> {
    try {
      this.logger.log('Trying to create a narration');
      const newNarration = new this.narrationModel(narration);
      const savedNarration = await newNarration.save();
      this.logger.log('New narration has been created');
      return savedNarration;
    } catch (error) {
      this.logger.error('Error updating narration', error);
      throw new HttpException(
        'Narration creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCount(): Promise<number> {
    return await this.narrationModel.countDocuments().exec();
  }

  async getNarration(): Promise<Narration> {
    const count = await this.getCount();
    if (count === 0) {
      this.logger.warn('No narrations available');
      throw new Error('No narrations available.');
    }

    const randomIndex = Math.floor(Math.random() * count);

    const narration = await this.narrationModel
      .findOne()
      .skip(randomIndex)
      .populate('questions')
      .exec();

    if (!narration) {
      throw new Error('Narration not found.');
    }

    return narration;
  }
}
