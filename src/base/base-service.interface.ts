import { Model } from 'mongoose';
import { IParamQuery } from './base-repository.interface';

export interface IBaseService<T> {
  getAll(params: IParamQuery<T>): Promise<T[]>;
  getOne(params: IParamQuery<T>): Promise<T>;
  updateOne(params: IParamQuery<T>): Promise<any>;
  updateMany(params: IParamQuery<T>): Promise<any>;
  createOne(params: IParamQuery<T>): Promise<T>;
  createMany(params: IParamQuery<T>): Promise<any[]>;
  deleteOne(params: IParamQuery<T>): Promise<any>;
  deleteMany(params: IParamQuery<T>): Promise<any>;
  count(params: IParamQuery<T>): Promise<number>;
  findOneAndUpdate(params: IParamQuery<T>): Promise<T>;
  findOneAndDelete(params: IParamQuery<T>): Promise<T>;
  getModel(): Model<T>;
  aggregate(params: any[]): Promise<any[]>;
  bulkWrite(bulk: any, options: any): Promise<void>;
  distinct(field: string, params?: IParamQuery<T>): Promise<any>;
}
