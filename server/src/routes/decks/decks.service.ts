import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Deck } from 'src/schemas/deck.schema';
import { AddDeckSchemaType, deckWithoutCards } from './decks.dto';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Tag } from 'src/schemas/tag.schema';

@Injectable()
export class DecksService {
  PRIVATE_KEY = process.env.PRIVATE_KEY as string;
  constructor(
    @InjectModel(Deck.name)
    private readonly deckModel: Model<Deck>,
    @InjectModel(Tag.name)
    private readonly tagModel: Model<Tag>,
  ) {}

  async GetDecks(token: string): Promise<deckWithoutCards[]> {
    const obj: JwtPayload = verify(token, this.PRIVATE_KEY) as JwtPayload;

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
    console.log('refetch');
    return returnedValue;
  }

  async CreateDeck(token: string, addDeckSchemaType: AddDeckSchemaType) {
    const obj: JwtPayload = verify(token, this.PRIVATE_KEY) as JwtPayload;

    const { deckName, tags, description } = addDeckSchemaType;
    const tagObjectIds: Types.ObjectId[] = [];
    for (const tagName of tags) {
      const existingTag = await this.tagModel.findOne({
        tag_name: tagName.name,
      });
      if (existingTag) {
        tagObjectIds.push(existingTag._id);
      } else {
        const newTag = await this.tagModel.create({ tag_name: tagName.name });
        tagObjectIds.push(newTag._id);
      }
    }
    const response = await this.deckModel.insertOne({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      auther: obj.user_id,
      cards: [],
      creation_date: Date.now(),
      deck_name: deckName,
      description: description,
      isPublic: false,
      tags: tagObjectIds,
    });

    const returnedValue: deckWithoutCards = {
      _id: response._id.toString(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      author: obj.username,
      card_amount: 0,
      cover_img: 'idk',
      creation_date: response.creation_date,
      deck_name: response.deck_name,
      description: response.description,
      learn: 0,
      new: 0,
      review: 0,
      tags: tags.map((e) => e.name),
    };
    return returnedValue;
  }
}
