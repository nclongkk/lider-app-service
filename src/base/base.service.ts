import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';

import { IBaseService } from './base-service.interface';
import { IBaseRepository, IParamQuery } from './base-repository.interface';

@Injectable()
export class BaseService<T extends Document> implements IBaseService<T> {
  constructor(private readonly repository: IBaseRepository<T>) {}

  async getAll(params?: IParamQuery<T>): Promise<T[]> {
    return this.repository.getAll(params);
  }

  async getOne(params: IParamQuery<T>): Promise<T> {
    return this.repository.getOne(params);
  }

  async deleteOne(params: IParamQuery<T>) {
    return this.repository.deleteOne(params);
  }

  async deleteMany(params: IParamQuery<T>) {
    return this.repository.deleteMany(params);
  }

  async createOne(params: IParamQuery<T>): Promise<T> {
    return this.repository.createOne(params);
  }

  async createMany(params: IParamQuery<T>) {
    return this.repository.createMany(params);
  }

  async updateOne(params: IParamQuery<T>): Promise<any> {
    return this.repository.updateOne(params);
  }

  async updateMany(params: IParamQuery<T>): Promise<any> {
    return this.repository.updateMany(params);
  }

  async count(params: IParamQuery<T>): Promise<number> {
    return this.repository.count(params);
  }

  async findOneAndUpdate(params: IParamQuery<T>): Promise<T> {
    return this.repository.findOneAndUpdate(params);
  }

  async findOneAndDelete(params: IParamQuery<T>): Promise<T> {
    return this.repository.findOneAndDelete(params);
  }

  async aggregate(params: any[]): Promise<any[]> {
    return this.repository.aggregate(params);
  }

  async bulkWrite(bulk, options?): Promise<void> {
    return this.repository.bulkWrite(bulk, options);
  }

  getModel(): Model<T> {
    return this.repository.getModel();
  }

  async distinct(field: string, params?: IParamQuery<T>): Promise<any> {
    return this.repository.distinct(field, params);
  }
}
