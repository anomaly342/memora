import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { DecksService } from './decks.service';

@Controller('decks')
export class DecksController {
  constructor(private readonly deckService: DecksService) {}

  @Get('')
  async GetDecks(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['jwt-token'] as string;
    const deckList = await this.deckService.GetDecks(token);

    return res.status(200).json(deckList);
  }

  //   @Post('')
  //   async CreateDeck(@Body() body, @Res() res: Response) {}

  //   @Delete(':deckId')
  //   async DeleteDeck(@Param() params: Record<'deckId', string>) {}
}
