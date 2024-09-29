import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Narration } from './schema/narration.schema';
import { Question } from './schema/question.schema';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  testApp(): string {
    return 'Hello World!';
  }

  @Post('/create-narration')
  async createNarration(@Body() body: Narration): Promise<Narration> {
    return await this.appService.createNarration(body);
  }
  @Post('/create-question')
  async createQuestion(@Body() body: Question): Promise<Question> {
    return await this.appService.createQuestion(body);
  }
}
