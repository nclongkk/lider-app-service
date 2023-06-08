import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id?: mongoose.Schema.Types.ObjectId;

  @Prop()
  token: string;

  @Prop()
  webUrl: string;

  @Prop({ type: Date })
  genTokenAt: Date;
}

const schema = SchemaFactory.createForClass(User);

export const UserSchema = schema;
