import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceLevelLogger } from 'src/infrastructure';
import { User, UserDocument } from 'src/schema/user.schema';

type TBotUser = {
  first_name: string;
  last_name: string;
  id: string;
  username?: string;
};

@Injectable()
export class UserService {
  @Inject('USERS_SERVICE_LOGGER')
  private logger: ServiceLevelLogger;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(user: TBotUser): Promise<UserDocument> {
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
}
