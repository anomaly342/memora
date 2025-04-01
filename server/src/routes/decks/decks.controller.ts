import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DecksService } from './decks.service';
import { AddDeckSchema, AddDeckSchemaType } from './decks.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('decks')
export class DecksController {
  constructor(private readonly deckService: DecksService) {}

  @Get('')
  async GetDecks(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['jwt-token'] as string;
    const deckList = await this.deckService.GetDecks(token);

    return res.status(200).json(deckList);
  }

  @Post('')
  @UsePipes(new ZodValidationPipe(AddDeckSchema))
  async CreateDeck(
    @Body() addDeckSchemaType: AddDeckSchemaType,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = req.cookies['jwt-token'] as string;
    const response = await this.deckService.CreateDeck(
      token,
      addDeckSchemaType,
    );

    return res.status(200).json(response);
  }

  //   @Delete(':deckId')
  //   async DeleteDeck(@Param() params: Record<'deckId', string>) {}
}
