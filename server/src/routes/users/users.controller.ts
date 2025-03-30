import { Controller, Get, HttpStatus, Param, Req, Res } from '@nestjs/common';
import { IdParams } from './users.dto';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
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

  @Get('')
  GetOwnUserInfo(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['jwt-token'] as string;

    const result = this.usersService.GetOwnUserInfo(token);

    return res.json(result);
  }
}
