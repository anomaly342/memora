import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from 'src/schemas/account.schema';
import { IdParams, UserResponse } from './users.dto';
import { JwtPayload, verify } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  PRIVATE_KEY = process.env.PRIVATE_KEY as string;
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<Account>,
  ) {}

  async GetUserInfo(params: IdParams): Promise<UserResponse | null> {
    const response = await this.accountModel.findOne({ _id: params.id }).exec();

    if (response) {
      const userResponse: UserResponse = { name: response.username };
      return userResponse;
    } else {
      return null;
    }
  }

  GetOwnUserInfo(token: string): UserResponse {
    const obj: JwtPayload = verify(token, this.PRIVATE_KEY) as JwtPayload;
    return { name: obj.username as string };
  }
}
