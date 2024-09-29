import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AnsweredQuestionsByUserDocument =
  HydratedDocument<AnsweredQuestionsByUser>;

@Schema()
export class AnsweredQuestionsByUser {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  })
  questionId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Answer' })
  selectedAnswerId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  receivedPoints: number;
}

export const AnsweredQuestionsByUserSchema = SchemaFactory.createForClass(
  AnsweredQuestionsByUser,
);
