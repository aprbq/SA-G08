export interface OrderItemInterface {
    ID?:            number;
    order_quantity?: number;   // ปริมาณของรายการในออเดอร์
    total_item?:     number;   // จำนวนรวมของรายการ
    order_id?:       number;   // ID ของออเดอร์
    ordersweet_id?:  number | undefined;   // ID ของการเลือกความหวาน
    name?:           string;   // ชื่อของเมนู
    price?:          number;       // ราคาของเมนู
    menu_id?:       number | undefined;
    

}
