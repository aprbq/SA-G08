export interface OrderInterface {
    ID?: number; // ควรมีฟิลด์นี้ในข้อมูลที่ส่ง
    name?: string; // ควรมีฟิลด์นี้ในข้อมูลที่ส่ง
    promotion_id?: number 
    paymentmethod_id?: number 
    order_date?: string;
    total_price?: number; // ฟิลด์ที่ใช้แทน total_item
}
