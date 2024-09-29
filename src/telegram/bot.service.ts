import { Injectable,Inject} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository,getRepository,Connection} from 'typeorm';
import { ServiceLevelLogger } from 'src/infrastructure';
const crypto = require('crypto');
import uuid4, { uuid } from 'uuidv4';

@Injectable()
export class BotService{
  @Inject('BOT_SERVICE_LEVEL_LOGGER')
  private logger:ServiceLevelLogger;
  constructor(){}
}