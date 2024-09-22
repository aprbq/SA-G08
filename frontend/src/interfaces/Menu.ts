export interface MenuInterface {
	ID?: number;
	name?: string;
	description?:   string;
	price?: number;
	picture?: string;
	category_id?: number;
	stock_id?: number;
	employee_id?: number;
	menu_ingredients?: {
		ingredient_id: number;
		quantity: string;
	  }[];
	condition?: {
	menu_id: number;
	}[];
  }
  