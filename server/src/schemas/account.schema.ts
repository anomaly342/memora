import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema({})
export class Account {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  password: string;

  @Prop({ required: true })
  google_account: boolean;

  @Prop()
  google_id: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
