import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Tag, TagDocument } from './tag.schema';
import { Account, AccountDocument } from './account.schema';
import { Card, CardSchema } from './card.schema';

export type DeckDocument = HydratedDocument<Deck>;

@Schema({ timestamps: true }) // Consider adding timestamps for createdAt and updatedAt
export class Deck {
  @Prop({ required: true })
  deck_name: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Account.name })
  auther: AccountDocument;

  @Prop({ required: true, type: SchemaTypes.Date })
  creation_date: Date;

  @Prop({ required: true })
  isPublic: boolean;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: Tag.name }] })
  tags: TagDocument[];

  @Prop({
    type: [CardSchema],
    default: [],
  })
  cards: Card[];

  @Prop()
  description: string;
}

const DeckSchema = SchemaFactory.createForClass(Deck);

// Pre-save hook to automatically calculate card_amout

export { DeckSchema };
