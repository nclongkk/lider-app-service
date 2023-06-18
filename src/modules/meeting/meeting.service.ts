import { BadRequestException, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { AppConfigService } from '../../config/config.service';
import { AppRepository } from '../../database/app.repository';
import { CostTracking } from '../../database/schemas';
import { errorNotFoundMsg } from '../../i18n/i18n.helper';
import { PaginationParam } from '../../shared/interfaces';
import { PaymentService } from '../../shared/services/payment-service/payment.service';
import { calculateTotalMeetingDuration } from '../../shared/utils/common.util';
import { createMongoIdByTimestamp } from '../../utils';
import { MEETING_STATUS } from './constants/meetings.constant';
import * as _ from 'lodash';

@Injectable()
export class MeetingService {
  constructor(
    private readonly appRepository: AppRepository,
    private readonly configService: AppConfigService,
    private readonly paymentService: PaymentService,
  ) {}
  async meetingHistory(
    userId: string,
    { page, limit }: PaginationParam,
    query: any,
  ) {
    const where: any = {
      appId: userId,
    };

    if (query?.from) {
      where._id = {
        $gte: createMongoIdByTimestamp(
          moment.utc(query.from).startOf('day').valueOf() / 1000,
          'from-time',
        ),
      };
    }

    if (query?.to) {
      where._id = {
        ...where._id,
        $lte: createMongoIdByTimestamp(
          moment.utc(query.to).endOf('day').valueOf() / 1000,
          'to-time',
        ),
      };
    }

    if (query?.isActive === 'true') {
      where.endedAt = null;
    }

    if (query?.isEnded === 'true' && query?.isActive !== 'true') {
      where.endedAt = {
        $ne: null,
      };
    }

    if (query?.accessType) {
      where.accessType = query.accessType;
    }

    if (query?.roomId) {
      where.customRoomId = query.roomId;
    }

    if (query.unpaid === 'true') {
      _.set(where, 'status.$in', [MEETING_STATUS.UNPAID]);
    }

    if (query.paid === 'true') {
      _.set(where, 'status.$in', [
        ..._.get(where, 'status.$in', []),
        MEETING_STATUS.PAID,
      ]);
    }

    return this.appRepository.meeting.getAllWithPaging({
      where,
      page,
      limit,
    });
  }

  calculateAmount(meeting): CostTracking {
    // const meeting = await this.appRepository.meeting.getOne({
    //   where: {
    //     _id: '645a4306abd85efaaf524c2b',
    //   },
    // });

    const minutes = calculateTotalMeetingDuration(meeting);
    const totalCost = minutes * this.configService.get('fee.feePerMin');
    return {
      totalMinutes: minutes,
      costPerMinute: this.configService.get('fee.feePerMin'),
      totalCost,
    };
  }

  async retryCharge(meetingId: string, user: any) {
    console.log('retryCharge', meetingId, user);
    const meeting = await this.appRepository.meeting.getOne({
      where: {
        _id: meetingId,
      },
      select: 'appId status endedAt costTracking',
    });

    if (!meeting) {
      throw new BadRequestException(errorNotFoundMsg('Meeting'));
    }

    if (meeting.status === MEETING_STATUS.PAID) {
      throw new BadRequestException('Meeting is already paid');
    }

    try {
      const { result: payment } = await this.paymentService.chargeServiceFee({
        amount: meeting.costTracking.totalCost,
        userId: String(meeting.appId),
        meetingId: String(meeting._id),
      });
      return this.appRepository.meeting.updateOne({
        where: {
          _id: meetingId,
        },
        data: {
          $set: {
            status: MEETING_STATUS.PAID,
            paymentId: payment._id,
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(
        error.response?.data?.message || error.message,
      );
    }
  }
}
