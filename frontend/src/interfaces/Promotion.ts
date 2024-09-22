export interface PromotionInterface {
ID?:            number;
promo?:         number;
promotion_name?: string;
description?:   string;
start_date?:     string;
end_date?:       string;
points_added?:   number;
points_use?:     number;
discount_value?: number;
discount_type_id?:  number;
promotion_type_id?: number;
status_id?:        number;
employee_id?:         number;
menu_id?:         number;
menu?: number[];
condition?: {
    menu_id: number;
  }[];
}
