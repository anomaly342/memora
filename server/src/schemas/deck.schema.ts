import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Tag } from './tag.schema';
import { Account } from './account.schema';
import { Card, CardSchema } from './card.schema';

export type DeckDocument = HydratedDocument<Deck>;

@Schema({ timestamps: true }) // Consider adding timestamps for createdAt and updatedAt
export class Deck {
  @Prop({ required: true })
  deck_name: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Account.name })
  auther: Types.ObjectId;

  @Prop({ required: true })
  isPublic: boolean;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Tag.name })
  tags: [Types.ObjectId];

  @Prop({ required: true })
  creation: Date;

  @Prop({
    type: {
      new: [CardSchema],
      learning: [CardSchema],
      review: [CardSchema],
    },
    default: { new: [], learning: [], review: [] },
  })
  cards: {
    new: Card[];
    learning: Card[];
    review: Card[];
  };

  @Prop()
  description: string;

  @Prop({ required: true })
  card_amout: number;
}

const DeckSchema = SchemaFactory.createForClass(Deck);

// Pre-save hook to automatically calculate card_amout
DeckSchema.pre('save', function (next) {
  this.card_amout =
    (this.cards?.new?.length || 0) +
    (this.cards?.learning?.length || 0) +
    (this.cards?.review?.length || 0);
  next();
});

export { DeckSchema };
