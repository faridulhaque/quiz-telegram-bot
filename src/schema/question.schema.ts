import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ minlength: 50, required: true, unique: true })
  narration: string;

  @Prop({ required: true })
  question: string;

  @Prop({
    required: true,
    length: 4,
    type: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        answer: String,
        isCorrect: Boolean,
      },
    ],
  })
  answers: {
    _id: mongoose.Types.ObjectId;
    answer: string;
    isCorrect: boolean;
  }[];

  @Prop({ required: true, min: 1 })
  points: number;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
