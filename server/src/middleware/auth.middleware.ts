import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private PRIVATE_KEY = process.env.PRIVATE_KEY as string;
  use(req: Request, res: Response, next: NextFunction) {
    const jwtToken = req.cookies['jwt-token'] as string | undefined;
    if (!jwtToken) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
    try {
      verify(jwtToken, this.PRIVATE_KEY);
      return next();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
  }
}
