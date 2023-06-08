import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
class Log {
  @Prop({ type: String })
  type: string;

  @Prop({ type: Date })
  at: Date;

  @Prop({ type: Number })
  by: number;

  @Prop({ type: Object })
  data?: any;
}

const LogSchema = SchemaFactory.createForClass(Log);

export { Log, LogSchema };
