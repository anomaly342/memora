export interface deckWithoutCards {
	_id: string;
	deck_name: string;
	cover_img: string;
	tags: string[];
	auther: string;
	creation_date: Date;
	description: string;
	new: number;
	learn: number;
	review: number;
	card_amount: number;
}
