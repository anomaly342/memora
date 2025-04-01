import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

@Controller('decks')
export class UsersController {
  constructor(private readonly deckService: DecksService) {}

  @Get('')
  async GetDecks(@Res() res: Response) {
    const deckList = await this.deckService.GetDecks();

    if (!deckList) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    return deckList;
  }

  @Post('')
  async CreateDeck(@Body() body, @Res() res: Response) {}

  @Delete(':deckId')
  async DeleteDeck(@Param params: Record<'deckId', string>) {}
}
