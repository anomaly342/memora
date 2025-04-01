import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TagDocument = HydratedDocument<Tag>;

@Schema({})
export class Tag {
  @Prop({
    required: true,
    unique: true,
    collation: {
      locale: 'en',
      strength: 2,
    },
  })
  tag_name: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
