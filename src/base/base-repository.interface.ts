import { FilterQuery, Model, Document, SortOrder } from 'mongoose';
interface IPopulate {
  path: string;
  select?: string;
  populate?: IPopulate;
  match?: any;
  options?: any;
}

type Sort =
  | string
  | { [key: string]: SortOrder | { $meta: 'textScore' } }
  | [string, SortOrder][]
  | undefined
  | null;

export interface IParamQuery<T> {
  ignoreCheckLimit?: boolean;
  page?: number;
  limit?: number;
  sort?: Sort;
  isLean?: boolean;
  populate?: IPopulate[];
  skip?: number;
  select?: string;
  where?: FilterQuery<T>;
  data?: any;
  options?: Record<string, unknown>;
  filter?: any;
}

export interface IBaseRepository<T> {
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
  bulkWrite(bulk: any, options: any): Promise<any>;
  distinct(field: string, params?: IParamQuery<T>): Promise<any>;
}
