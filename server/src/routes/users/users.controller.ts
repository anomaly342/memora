import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { IdParams } from './users.dto';
import { UsersService } from './users.service';
import { Response } from 'express';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async GetUserInfo(@Param() params: IdParams, @Res() res: Response) {
    const result = await this.usersService.GetUserInfo(params);

    if (!result) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    return res.json(result);
  }
}
