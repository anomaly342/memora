import { Get, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Deck } from 'src/schemas/deck.schema';
import { AddDeckSchemaType, CardUpdate, deckWithoutCards } from './decks.dto';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Tag } from 'src/schemas/tag.schema';
import { Card } from 'src/schemas/card.schema';

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
    const returnedValue: deckWithoutCards[] = [];

    response.map((e) => {
      const { _id, deck_name, creation_date, tags, cards, description } = e;
      let _new = 0;
      let learn = 0;
      let review = 0;

      cards.map((card) => {
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
        auther: obj.username,
        cover_img: 'idk',
        card_amount: cards.length,
        deck_name: deck_name,
        creation_date: creation_date,
        tags: tags.map((e) => e.tag_name),
        description: description,
        learn: learn,
        new: _new,
        review: review,
      });
    });
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
      auther: obj.username,
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

  async getDeck(token: string, deckId: string) {
    const obj: JwtPayload = verify(token, this.PRIVATE_KEY) as JwtPayload;

    if (!Types.ObjectId.isValid(deckId)) {
      return null;
    }
    const response = await this.deckModel
      .findOne({ _id: deckId, auther: obj.user_id })
      .populate('auther')
      .populate('tags')
      .exec();

    if (!response) {
      return null;
    }

    const { auther, cards, creation_date, deck_name, description, tags } =
      response;

    let _new = 0;
    let learn = 0;
    let review = 0;

    cards.map((card) => {
      if (card.status === 'new') {
        _new++;
      } else if (card.status === 'learning') {
        learn++;
      } else if (card.status === 'review') {
        if (card.scheduled_review !== null) {
          if (card.scheduled_review.toISOString() < new Date().toISOString()) {
            review++;
          }
        }
      }
    });

    const returnedValue: deckWithoutCards = {
      _id: response._id.toString(),
      card_amount: cards.length,
      auther: auther.username,
      cover_img: 'idk',
      creation_date: creation_date,
      deck_name: deck_name,
      description: description,
      learn: learn,
      new: _new,
      review: review,
      tags: tags.map((e) => e.tag_name),
    };

    return returnedValue;
  }

  async getCards(token: string, deckId: string) {
    const obj: JwtPayload = verify(token, this.PRIVATE_KEY) as JwtPayload;

    if (!Types.ObjectId.isValid(deckId)) {
      return null;
    }

    const response = await this.deckModel
      .findOne({ _id: deckId, auther: obj.user_id }, { cards: 1, _id: 0 })
      .exec();

    if (!response) {
      return null;
    }

    const { cards } = response;

    const new_cards: Card[] = [];
    cards.map((e) => {
      if (e.status === 'new') {
        new_cards.push(e);
      } else if (e.status === 'learning') {
        new_cards.push(e);
      } else {
        if (e.scheduled_review !== null) {
          if (e.scheduled_review.toISOString() < new Date().toISOString()) {
            new_cards.push(e);
          }
        }
      }
    });

    return { cards: new_cards };
  }

  async updateCard(token: string, deckId: string, json: CardUpdate) {
    const obj: JwtPayload = verify(token, this.PRIVATE_KEY) as JwtPayload;
    console.log(deckId, json.uuid);
    try {
      if (!Types.ObjectId.isValid(deckId)) {
        console.log('test');
        return null; // Or throw a BadRequestException
      }
      const awsdf = await this.deckModel.findOne({ _id: deckId });
      console.log(awsdf);
      const updatedDeck = await this.deckModel.findOneAndUpdate(
        { _id: deckId, auther: obj.user_id, 'cards.uuid': json.uuid },
        {
          $set: {
            'cards.$.ease': json.ease,
            'cards.$.status': json.status,
            'cards.$.step': json.step,
            'cards.$.interval': json.interval,
            'cards.$.scheduled_review': json.scheduled_review,
            'cards.$.goodStreak': json.goodStreak,
          },
        },
        { new: true }, // Return the entire updated document
      );
      console.log(updatedDeck);
      if (updatedDeck) {
        const updatedCard = updatedDeck.cards.find(
          (card) => card.uuid && card.uuid.toString() === json.uuid,
        );
        return updatedCard || null;
      }

      return null;
    } catch (e) {
      console.error(e);
      return null; // Or throw an appropriate exception
    }
  }

  async deleteDeck(token: string, deckId: string) {
    const obj: JwtPayload = verify(token, this.PRIVATE_KEY) as JwtPayload;

    if (!Types.ObjectId.isValid(deckId)) {
      return null;
    }

    const response = await this.deckModel
      .deleteOne({ _id: deckId, auther: obj.user_id })
      .exec();

    return response.acknowledged;
  }
}
