import { Injectable } from '@nestjs/common';
import {
  DefaultLoginSchemaType,
  JWTSchemaType,
  SignUpSchemaType,
} from './authentication.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from 'src/schemas/account.schema';

import { compareSync, hashSync, genSaltSync } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class AuthenticationService {
  PRIVATE_KEY = process.env.PRIVATE_KEY as string;

  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<Account>,
  ) {}

  async Login(defaultLoginSchema: DefaultLoginSchemaType) {
    const { username, password } = defaultLoginSchema;
    const returnedAccount = await this.accountModel
      .find({ username: username })
      .exec();

    if (!returnedAccount.length) {
      // Username not found
      return null;
    }

    const {
      username: _username,
      password: _password,
      _id: id,
    } = returnedAccount[0];
    const result = compareSync(password, _password);

    if (result) {
      // Correct password
      const token = sign(
        { user_id: id, username: _username },
        this.PRIVATE_KEY,
        {
          expiresIn: '7d',
        },
      );

      return token;
    }
    {
      // Incorrect Password
      return null;
    }
  }

  async Register(signUpSchema: SignUpSchemaType) {
    const { username, password } = signUpSchema;

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    const isExisted = await this.accountModel.find({ username: username });

    if (isExisted.length !== 0) {
      return null;
    }

    const insertedAccount = await this.accountModel.insertOne({
      username: username,
      password: hashedPassword,
      google_account: false,
    });

    const { _id: id, username: _username } = insertedAccount;
    const token = sign({ user_id: id, username: _username }, this.PRIVATE_KEY, {
      expiresIn: '7d',
    });

    return token;
  }

  Check(JWTSchema: JWTSchemaType) {
    try {
      verify(JWTSchema.jwt_token, this.PRIVATE_KEY);

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      return false;
    }
  }
}
