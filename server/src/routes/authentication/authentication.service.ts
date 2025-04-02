import { Injectable } from '@nestjs/common';
import {
  DefaultLoginSchemaType,
  JWTSchemaType,
  SignUpSchemaType,
} from './authentication.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Account } from 'src/schemas/account.schema';
import { OAuth2Client } from 'google-auth-library';
import { compareSync, hashSync, genSaltSync } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { google } from 'googleapis';
@Injectable()
export class AuthenticationService {
  private PRIVATE_KEY = process.env.PRIVATE_KEY as string;
  private SERVER_URL = process.env.SERVER_URL as string;
  private CLIENT_ID = process.env.CLIENT_ID as string;
  private CLIENT_SECRET = process.env.CLIENT_SECRET as string;
  private REDIRECT_URI = `${this.SERVER_URL}/authentication/google`;

  private oauth2Client = new OAuth2Client(
    this.CLIENT_ID,
    this.CLIENT_SECRET,
    this.REDIRECT_URI,
  );

  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<Account>,
  ) {}

  _generateToken(id: Types.ObjectId, username: string) {
    return sign({ user_id: id, username: username }, this.PRIVATE_KEY, {
      expiresIn: '7d',
    });
  }

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
      const token = this._generateToken(id, _username);

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
    const token = this._generateToken(id, _username);

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

  async Google(code: string) {
    try {
      // Exchange authorization code for access token
      const { tokens } = await this.oauth2Client.getToken(code);

      if (!tokens.access_token) {
        return null;
      }

      // Use access token to fetch user info
      this.oauth2Client.setCredentials(tokens);
      const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
      const { data: userInfo } = await oauth2.userinfo.get();

      const isExisted = await this.accountModel
        .findOne({ google_id: userInfo.id })
        .exec();

      // If user has previously logged in with a Google account
      if (isExisted) {
        const { _id, username } = isExisted;
        const token = this._generateToken(_id, username);

        return token;
      }

      // If user logs in with a Google account for the first time
      const result = await this.accountModel.insertOne({
        username: userInfo.given_name,
        google_account: true,
        google_id: userInfo.id,
      });

      const { _id, username } = result;

      const token = this._generateToken(_id, username);
      return token;
    } catch (error) {
      console.error('Error during Google authentication:', error);
      return null;
    }
  }
}
