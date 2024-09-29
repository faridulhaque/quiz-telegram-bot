import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true, type: [{ answer: String, isCorrect: Boolean }] })
  answers: { answer: string; isCorrect: boolean }[];

  @Prop({ required: true, min: 1 })
  points: number;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
