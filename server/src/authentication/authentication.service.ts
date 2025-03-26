import { Injectable } from '@nestjs/common';
import { DefaultLoginSchemaType } from './authentication.dto';
@Injectable()
export class AuthenticationService {
  Login(defaultLoginSchema: DefaultLoginSchemaType): string {
    return 'Hello World!';
  }
}
