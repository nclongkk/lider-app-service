import { Injectable } from '@nestjs/common';
import { Model, Document, Aggregate } from 'mongoose';

import { QUERY_SELECT_LIMIT } from '../constants';
import { PaginationParam, PaginationResult } from '../shared/interfaces';
import { IBaseRepository, IParamQuery } from './base-repository.interface';

@Injectable()
export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(private readonly baseModule: Model<T>) {}

  async getAll(params?: IParamQuery<T>): Promise<T[]> {
    const limit = QUERY_SELECT_LIMIT;
    params = Object.assign(
      {
        limit,
        page: 1,
        sort: { _id: -1 },
        isLean: true,
      },
      params,
    );

    params.limit =
      params.limit > 0 && params.limit <= limit ? +params.limit : limit;
    params.skip = (params.page - 1) * params.limit;

    if (params.ignoreCheckLimit) {
      return this.baseModule
        .find(params.where)
        .select(params.select)
        .sort(params.sort)
        .populate(params.populate)
        .lean(params.isLean);
    }

    return this.baseModule
      .find(params.where)
      .limit(params.limit)
      .select(params.select)
      .sort(params.sort)
      .skip(params.skip)
      .populate(params.populate)
      .lean(params.isLean);
  }

  async getOne(params: IParamQuery<T>): Promise<T> {
    params = Object.assign(
      {
        isLean: true,
      },
      params,
    );

    return this.baseModule
      .findOne(params.where)
      .select(params.select)
      .populate(params.populate)
      .lean(params.isLean);
  }

  async deleteOne(params: IParamQuery<T>) {
    return this.baseModule.deleteOne(params.where);
  }

  async deleteMany(params: IParamQuery<T>) {
    return this.baseModule.deleteMany(params.where);
  }

  async createOne(params: IParamQuery<T>): Promise<T> {
    return this.baseModule.create(params.data);
  }

  async createMany(params: IParamQuery<T>): Promise<any[]> {
    return this.baseModule.insertMany(params.data);
  }

  async updateOne(params: IParamQuery<T>): Promise<any> {
    return this.baseModule.updateOne(params.where, params.data, {
      runValidators: true,
      ...params.options,
    });
  }

  async updateMany(params: IParamQuery<T>): Promise<any> {
    return this.baseModule.updateMany(params.where, params.data, {
      ...params.options,
    });
  }

  async count(params: IParamQuery<T>): Promise<number> {
    return this.baseModule.countDocuments(params.where);
  }

  async findOneAndUpdate(params: IParamQuery<T>): Promise<T> {
    params = Object.assign(
      {
        isLean: true,
      },
      params,
    );

    return this.baseModule
      .findOneAndUpdate(params.where, params.data, {
        runValidators: true,
        ...params.options,
      })
      .select(params.select)
      .populate(params.populate)
      .lean(params.isLean);
  }

  async findOneAndDelete(params: IParamQuery<T>): Promise<T> {
    return this.baseModule.findOneAndDelete(params.where, params.options);
  }

  async aggregate(params: any[]): Promise<any[]> {
    return this.baseModule.aggregate(params);
  }

  async bulkWrite(bulk, options?): Promise<void> {
    return this.baseModule.bulkWrite(bulk, options);
  }

  getModel(): Model<T> {
    return this.baseModule;
  }

  async distinct(field: string, params?: IParamQuery<T>): Promise<any> {
    return this.baseModule.distinct(field, params.where);
  }

  async getAllWithPaging(params: IParamQuery<T>): Promise<PaginationResult<T>> {
    const [records, total] = await Promise.all([
      this.getAll(params),
      this.count(params),
    ]);

    return {
      paging: {
        total,
        page: params.page,
        limit: params.limit,
      },
      content: records,
    };
  }
}
