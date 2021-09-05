import {
  FindManyOptions, FindOneOptions, Repository,
} from 'typeorm';

export default class RepoBase<T> extends Repository<T> {
  async getOne(params: FindOneOptions) {
    const row = await this.findOne(params);
    return row;
  }

  async get(params: FindManyOptions) {
    const rows = await this.find(params);
    return rows;
  }
}
