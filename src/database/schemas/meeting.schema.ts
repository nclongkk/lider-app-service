import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MEETING_STATUS } from '../../modules/meeting/constants/meetings.constant';
import { ACCESS_TYPE } from '../../modules/user/constants/meeting-access-type.constant';

export type MeetingDocument = HydratedDocument<Meeting>;

@Schema({ _id: false })
export class MeetingMember {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  userId: string;

  @Prop()
  username: string;

  @Prop()
  avatar: string;

  @Prop({ type: Date })
  connectedAt: Date;

  @Prop({ type: Date })
  disconnectedAt: Date;

  @Prop({ type: Object })
  metadata: any;
}
const MeetingMemberSchema = SchemaFactory.createForClass(MeetingMember);

@Schema()
export class CostTracking {
  @Prop()
  totalMinutes: number;

  @Prop()
  costPerMinute: number;

  @Prop()
  totalCost: number;
}
const CostTrackingSchema = SchemaFactory.createForClass(CostTracking);

@Schema({ timestamps: true })
export class Meeting {
  _id?: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String })
  roomId?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  appId?: mongoose.Schema.Types.ObjectId;

  @Prop()
  customRoomId: string;

  @Prop()
  paymentId: string;

  @Prop({ type: [MeetingMemberSchema] })
  members: MeetingMember[];

  @Prop({ type: String })
  accessType: ACCESS_TYPE;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: MeetingMemberSchema })
  createdBy: MeetingMember;

  @Prop({ type: Date })
  endedAt: Date;

  @Prop({ type: CostTrackingSchema })
  costTracking: CostTracking;

  @Prop({ default: MEETING_STATUS.UNPAID })
  status: MEETING_STATUS;
}
const schema = SchemaFactory.createForClass(Meeting);
schema.index({ roomId: 1, appId: 1 });
schema.index({ customRoomId: 1 });
export const MeetingSchema = schema;
