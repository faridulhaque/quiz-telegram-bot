import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Question } from './question.schema';

export type NarrationDocument = HydratedDocument<Narration>;


@Schema()
export class Narration {
  @Prop({ minlength: 100, required: true, unique: true })
  narration: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }] })
  questions: Question[];
}

export const NarrationSchema = SchemaFactory.createForClass(Narration);

