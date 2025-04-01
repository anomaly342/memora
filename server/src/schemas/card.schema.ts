import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';

export type CardDocument = HydratedDocument<Card>;

@Schema({})
export class Card {
  @Prop({ required: true })
  front: string;

  @Prop({ required: true })
  back: string;

  @Prop({ required: true, default: null })
  ease: number | null;

  @Prop({ required: true, enum: ['new', 'learning', 'review'], default: 'new' })
  status: 'new' | 'learning' | 'review';

  @Prop({ reuqired: true, default: null, enum: [1, 2, 3, null] })
  step: 1 | 2 | 3 | null;

  @Prop({ required: true })
  interval: number;

  @Prop({ required: true, default: null })
  scheduled_review: Date | null;
}

export const CardSchema = SchemaFactory.createForClass(Card);
