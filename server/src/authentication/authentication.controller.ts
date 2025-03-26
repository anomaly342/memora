import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ZodValidationPipe } from 'src/utilities/ZodValidationPipe';
import {
  DefaultLoginSchema,
  DefaultLoginSchemaType,
} from './authentication.dto';
import { ApiBody } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(DefaultLoginSchema))
  @ApiBody({ schema: zodToOpenAPI(DefaultLoginSchema) })
  Login(@Body() defaultLoginSchema: DefaultLoginSchemaType) {
    return this.authenticationService.Login(defaultLoginSchema);
  }
}
