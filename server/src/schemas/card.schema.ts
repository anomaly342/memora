import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // Import the uuid library
export type CardDocument = HydratedDocument<Card>;

@Schema({})
export class Card {
  @Prop({ required: true })
  front: string;

  @Prop({ required: true })
  back: string;

  @Prop({ required: true, type: SchemaTypes.Decimal128, default: null })
  ease: number | null;

  @Prop({ required: true, enum: ['new', 'learning', 'review'], default: 'new' })
  status: 'new' | 'learning' | 'review';

  @Prop({ required: true, type: SchemaTypes.Int32, default: 0 })
  goodStreak: number;

  @Prop({
    reuqired: true,
    type: SchemaTypes.Int32,
    default: null,
    enum: [1, 2, 3, null],
  })
  step: 1 | 2 | 3 | null;

  @Prop({ required: true })
  interval: number;

  @Prop({ required: true, type: SchemaTypes.Date, default: null })
  scheduled_review: Date | null;

  @Prop({ type: String, default: () => uuidv4(), required: true }) // Add a UUID field with a default value
  uuid: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
