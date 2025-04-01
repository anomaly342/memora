import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deck } from 'src/schemas/deck.schema';
import { deckWithoutCards } from './decks.dto';
import { JwtPayload, verify } from 'jsonwebtoken';

@Injectable()
export class DecksService {
  PRIVATE_KEY = process.env.PRIVATE_KEY as string;
  constructor(
    @InjectModel(Deck.name)
    private readonly deckModel: Model<Deck>,
  ) {}

  async GetDecks(token: string): Promise<deckWithoutCards[]> {
    const obj: JwtPayload = verify(token, this.PRIVATE_KEY) as JwtPayload;
    console.log('');
    const response = await this.deckModel
      .find({ auther: obj.user_id })
      .populate('auther')
      .populate('tags')
      .exec();
    console.log(response[0]);
    const returnedValue: deckWithoutCards[] = [];

    response.map((e) => {
      const { _id, deck_name, creation_date, tags, cards, description } = e;
      let _new = 0;
      let learn = 0;
      let review = 0;

      cards.map((card) => {
        console.log(card.scheduled_review);
        if (card.status === 'new') {
          _new++;
        } else if (card.status === 'learning') {
          learn++;
        } else if (card.status === 'review') {
          if (card.scheduled_review !== null) {
            if (
              card.scheduled_review.toISOString() < new Date().toISOString()
            ) {
              review++;
            }
          }
        }
      });

      returnedValue.push({
        _id: _id.toString(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        author: obj.username,
        card_amount: _new + learn + review,
        cover_img: 'idk',
        deck_name: deck_name,
        creation_date: creation_date,
        tags: tags.map((e) => e.tag_name),
        description: description,
        learn: learn,
        new: _new,
        review: review,
      });
    });
    console.log(returnedValue);
    return returnedValue;
  }
}
