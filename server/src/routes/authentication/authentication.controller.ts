import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
  UsePipes,
} from '@nestjs/common';
import {
  DefaultLoginSchema,
  DefaultLoginSchemaType,
  JWTSchema,
  JWTSchemaType,
  SignUpSchema,
  SignUpSchemaType,
} from './authentication.dto';
import { AuthenticationService } from './authentication.service';
import { ZodValidationPipe } from 'src/utilities/ZodValidationPipe';

import { ApiBody } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { Response } from 'express';

@Controller('authentication')
export class AuthenticationController {
  CLIENT_URL = process.env.CLIENT_URL as string;
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(DefaultLoginSchema))
  @ApiBody({ schema: zodToOpenAPI(DefaultLoginSchema) })
  async Login(
    @Body() defaultLoginSchema: DefaultLoginSchemaType,
    @Res() res: Response,
  ) {
    const token = await this.authenticationService.Login(defaultLoginSchema);

    if (!token) {
      throw new HttpException(
        'Username not found or incorrect password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    res.cookie('jwt-token', token, { sameSite: 'none', secure: true });

    return res.sendStatus(200);
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(SignUpSchema))
  @ApiBody({ schema: zodToOpenAPI(SignUpSchema) })
  async Register(@Body() SignUpSchema: SignUpSchemaType, @Res() res: Response) {
    const token = await this.authenticationService.Register(SignUpSchema);

    if (!token) {
      throw new HttpException(
        'This username already exists',
        HttpStatus.UNAUTHORIZED,
      );
    }

    res.cookie('jwt-token', token, { sameSite: 'none', secure: true });

    return res.sendStatus(200);
  }

  @Post('check')
  @UsePipes(new ZodValidationPipe(JWTSchema))
  @ApiBody({ schema: zodToOpenAPI(JWTSchema) })
  Check(@Body() JWTSchema: JWTSchemaType, @Res() res: Response) {
    const result = this.authenticationService.Check(JWTSchema);

    return result ? res.sendStatus(200) : res.sendStatus(401);
  }

  @Get('google')
  async Google(@Query() queries: Record<string, string>, @Res() res: Response) {
    console.log(queries);
    const token = await this.authenticationService.Google(queries.code);

    if (!token) {
      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    res.cookie('jwt-token', token, { sameSite: 'none', secure: true });

    return res.redirect(this.CLIENT_URL);
  }
}
