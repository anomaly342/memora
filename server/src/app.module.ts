import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationController } from './routes/authentication/authentication.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationService } from './routes/authentication/authentication.service';
import { ConfigModule } from '@nestjs/config';

import { Account, AccountSchema } from './schemas/account.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_STRING as string),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  providers: [AppService, AuthenticationService],
  controllers: [AppController, AuthenticationController],
})
export class AppModule {}
