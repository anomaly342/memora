import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
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
}
