import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import * as moment from 'moment';
import { AppRepository } from '../../database/app.repository';
import { HelperService } from '../../helper/helper/helper.service';
import { createMongoIdByTimestamp } from '../../utils';

@Injectable()
export class StatisticService {
  constructor(
    private readonly appRepository: AppRepository,
    private readonly helperService: HelperService,
  ) {}

  async statisticTotalMeetings(user) {
    const [totalMeeting, totalActiveMeeting] = await Promise.all([
      this.appRepository.meeting.count({
        where: {
          appId: new mongoose.Types.ObjectId(user._id),
        },
      }),
      this.appRepository.meeting.count({
        where: {
          appId: new mongoose.Types.ObjectId(user._id),
          endedAt: { $exists: false },
        },
      }),
    ]);

    return {
      totalMeeting,
      totalActiveMeeting,
    };
  }

  async statisticTimeFrequency(user) {
    const rs = await this.appRepository.meeting.aggregate([
      {
        $match: {
          appId: new mongoose.Types.ObjectId(user._id),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%H',
              date: '$createdAt',
            },
          },
          duration: {
            $sum: '$costTracking.totalMinutes',
          },
        },
      },
      {
        $project: {
          _id: 0,
          hour: '$_id',
          duration: 1,
        },
      },
    ]);
    return this.helperService.fillAndSortData(rs);
  }

  async statisticMeetings(user, query) {
    const where: any = {
      appId: new mongoose.Types.ObjectId(user._id),
    };
    if (!query.from) {
      query.from = moment.utc().subtract(7, 'days').format('YYYY-MM-DD');
    }
    if (!query.to) {
      query.to = moment.utc().format('YYYY-MM-DD');
    }
    let format: '%Y-%m-%d' | '%Y-%m' | '%Y' = '%Y-%m-%d';
    if (moment.utc(query.to).diff(moment.utc(query.from), 'days') > 365) {
      format = '%Y';
    }
    if (moment.utc(query.to).diff(moment.utc(query.from), 'days') > 45) {
      format = '%Y-%m';
    }

    if (query.from) {
      where._id = {
        $gte: createMongoIdByTimestamp(
          moment.utc(query.from).startOf('day').valueOf() / 1000,
          'from-time',
        ),
      };
    }
    if (query.to) {
      where._id = {
        ...where._id,
        $lte: createMongoIdByTimestamp(
          moment.utc(query.to).endOf('day').valueOf() / 1000,
          'to-time',
        ),
      };
    }

    const statistic = await this.appRepository.meeting.aggregate([
      {
        $match: where,
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format,
              date: '$createdAt',
            },
          },
          'Total Meetings': {
            $sum: 1,
          },
          'Total Duration': {
            $sum: '$costTracking.totalMinutes',
          },
          'Total Users Join': {
            $sum: {
              $size: '$members',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          'Total Meetings': 1,
          'Total Duration': 1,
          'Total Users Join': 1,
        },
      },
    ]);

    if (format === '%Y-%m-%d') {
      return this.helperService.fillMissingDates(
        statistic,
        query.from,
        query.to,
      );
    }
  }
}
