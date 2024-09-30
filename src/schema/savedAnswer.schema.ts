import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SavedAnswersDocument = HydratedDocument<SavedAnswer>;

@Schema()
export class SavedAnswer {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  })
  questionId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  selectedAnswerId: string;

  @Prop({ required: true })
  receivedPoints: number;
}

export const SavedAnswerSchema = SchemaFactory.createForClass(SavedAnswer);
