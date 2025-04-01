export interface deckWithoutCards {
	_id: string;
	deck_name: string;
	cover_img: string;
	card_amount: number;
	tags: string[];
	author: string;
	creation_date: Date;
	description: string;
	new: number;
	learn: number;
	review: number;
}
