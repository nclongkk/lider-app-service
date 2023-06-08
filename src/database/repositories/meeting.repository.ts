import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../base/base.repository';
import { Meeting, MeetingDocument } from '../schemas/meeting.schema';

@Injectable()
export class MeetingRepository extends BaseRepository<MeetingDocument> {
  constructor(
    @InjectModel(Meeting.name)
    private readonly meetingModel: Model<MeetingDocument>,
  ) {
    super(meetingModel);
  }
}
