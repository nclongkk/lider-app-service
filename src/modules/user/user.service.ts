import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as moment from 'moment';

import { AppRepository } from '../../database/app.repository';
import { AppLoggerService } from '../../logger/logger.service';
import { PaginationParam } from '../../shared/interfaces';
import { PaymentService } from '../../shared/services/payment-service/payment.service';
import { createMongoIdByTimestamp, getHostPathFromUrl } from '../../utils';
import { encode, decode } from '../../utils/crypto';
import { MEETING_STATUS } from '../meeting/constants/meetings.constant';
import { MeetingService } from '../meeting/meeting.service';
import { MeetingStartDto } from './dto/meeting-start.dto';
import { UpdateUserMeetingDto } from './dto/update-user-meeting.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly appRepository: AppRepository,
    private readonly meetingService: MeetingService,
    private readonly paymentService: PaymentService,
    private readonly logger: AppLoggerService,
  ) {}

  async createUserApp(userId: string) {
    const genTokenAt = new Date();
    const token = encode({ userId, genTokenAt });
    const user = await this.appRepository.user.createOne({
      data: {
        _id: userId,
        genTokenAt,
        token,
      },
    });
  }

  async verifyToken({ token, webUrl, customRoomId }: VerifyTokenDto) {
    const { userId, genTokenAt } = decode(token);
    const user = await this.appRepository.user.getOne({
      where: {
        _id: userId,
      },
      select: '_id genTokenAt webUrl',
    });
    if (!user) {
      throw new ForbiddenException('Invalid token');
    }

    if (
      new Date(user.genTokenAt).getTime() !== new Date(genTokenAt).getTime()
    ) {
      throw new ForbiddenException('Invalid token');
    }

    if (user.webUrl !== webUrl) {
      throw new ForbiddenException('Invalid web url');
    }

    const meeting = await this.appRepository.meeting.getOne({
      where: {
        customRoomId: customRoomId,
        endedAt: null,
      },
      select: '_id',
    });

    return { ...user, meeting };
  }

  async getAppDetail(userId: string) {
    const user = await this.appRepository.user.getOne({
      where: {
        _id: userId,
      },
      select: '_id token webUrl',
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async updateAppWebUrl(userId: string, webUrl: string) {
    try {
      const { host } = getHostPathFromUrl(webUrl);
      const user = await this.appRepository.user.findOneAndUpdate({
        where: {
          _id: userId,
        },
        data: {
          webUrl: host,
        },
        options: {
          new: true,
        },
      });

      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async generateToken(userId: string): Promise<{ token: string }> {
    const genTokenAt = new Date();
    const token = encode({ userId, genTokenAt });
    await this.appRepository.user.updateOne({
      where: {
        _id: userId,
      },
      data: {
        genTokenAt,
        token,
      },
    });
    return { token };
  }

  async startNewMeeting(meetingStart: MeetingStartDto) {
    return await this.appRepository.meeting.createOne({
      data: {
        roomId: meetingStart.roomId,
        appId: meetingStart.appId,
        customRoomId: meetingStart.customRoomId,
        accessType: meetingStart.accessType,
        createdBy: {
          userId: meetingStart.createdBy.id,
          username: meetingStart.createdBy.username,
          avatar: meetingStart.createdBy.avatar,
        },
      },
    });
  }

  async updateNewUserJoinMeeting(
    roomId: string,
    updateUser: UpdateUserMeetingDto,
  ) {
    return this.appRepository.meeting.updateOne({
      where: { roomId, endedAt: null },
      data: {
        $push: {
          members: {
            ...updateUser,
            connectedAt: new Date(),
          },
        },
      },
    });
  }

  async updateUserLeaveMeeting(roomId: string, userId: string) {
    return this.appRepository.meeting.updateOne({
      where: {
        roomId,
        endedAt: null,
        'members.userId': userId,
      },
      data: {
        $set: {
          'members.$.disconnectedAt': new Date(),
        },
      },
    });
  }

  async endMeeting(roomId: string) {
    const meeting = await this.appRepository.meeting.getOne({
      where: { roomId, endedAt: null },
    });
    const costTracking = this.meetingService.calculateAmount(meeting);
    const $set: any = {
      endedAt: new Date(),
      costTracking,
    };
    try {
      const { result: payment } = await this.paymentService.chargeServiceFee({
        amount: costTracking.totalCost,
        userId: String(meeting.appId),
        meetingId: String(meeting._id),
      });
      $set.paymentId = payment._id;
      $set.status = MEETING_STATUS.PAID;
    } catch (error) {
      this.logger.error({
        msg: 'Charge service fee failed',
        error,
        log: {
          meeting,
          costTracking,
        },
      });
    }

    const [, room] = await Promise.all([
      this.appRepository.meeting.updateOne({
        where: { _id: meeting._id },
        data: {
          $set,
        },
      }),
      this.appRepository.meeting.updateMany({
        where: {
          _id: meeting._id,
          'members.disconnectedAt': null,
        },
        data: {
          $set: {
            'members.$[].disconnectedAt': new Date(),
          },
        },
        options: {
          multi: true,
          new: true,
        },
      }),
    ]);

    return room;
  }
}
