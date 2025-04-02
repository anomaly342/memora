import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DecksService } from './decks.service';
import { AddDeckSchema, AddDeckSchemaType, CardUpdate } from './decks.dto';
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

  @Get(':deckId')
  async getDeck(
    @Req() req: Request,
    @Res() res: Response,
    @Param() params: Record<'deckId', string>,
  ) {
    const deckId = params.deckId;
    const token = req.cookies['jwt-token'] as string;
    const response = await this.deckService.getDeck(token, deckId);

    if (!response) {
      return res.redirect(process.env.CLIENT_URL as string);
    }

    return res.status(200).json(response);
  }

  @Delete(':deckId')
  async DeleteDeck(
    @Param() params: Record<'deckId', string>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const deckId = params.deckId;
    const token = req.cookies['jwt-token'] as string;
    const response = await this.deckService.deleteDeck(token, deckId);

    if (response) {
      return res.sendStatus(200);
    } else {
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
  }

  @Get(':deckId/cards')
  async GetCards(
    @Res() res: Response,
    @Req() req: Request,
    @Param() params: Record<'deckId', string>,
  ) {
    const deckId = params.deckId;
    const token = req.cookies['jwt-token'] as string;
    const response = await this.deckService.getCards(token, deckId);

    if (!response) {
      return res.redirect(process.env.CLIENT_URL as string);
    }

    return res.status(200).json(response);
  }

  @Put(':deckId/cards')
  async UpdateCard(
    @Body() json: CardUpdate,
    @Res() res: Response,
    @Req() req: Request,
    @Param() params: Record<'deckId', string>,
  ) {
    const deckId = params.deckId;
    const token = req.cookies['jwt-token'] as string;
    const response = await this.deckService.updateCard(token, deckId, json);

    if (!response) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    return res.status(200).json(response);
  }
}
