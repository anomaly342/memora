import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from 'src/schemas/account.schema';
import { IdParams, UserReponse } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<Account>,
  ) {}

  async GetUserInfo(params: IdParams): Promise<UserReponse | null> {
    const response = await this.accountModel.findOne({ _id: params.id }).exec();

    if (response) {
      const userResponse: UserReponse = { name: response.username };
      return userResponse;
    } else {
      return null;
    }
  }
}
