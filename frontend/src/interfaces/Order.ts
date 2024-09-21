// export interface OrderInterface {
//     ID?: number; // ควรมีฟิลด์นี้ในข้อมูลที่ส่ง
//     name?: string; // ควรมีฟิลด์นี้ในข้อมูลที่ส่ง
//     promotion_id?: number 
//     paymentmethod_id?: number 
//     order_date?: string;
//     total_price?: number; // ฟิลด์ที่ใช้แทน total_item
// }

export interface OrderInterface {
    ID?: number; // ฟิลด์ ID
    promotion_id?: number; // ฟิลด์ promotion_id ใน backend
    paymentmethod_id?: number; // ฟิลด์ paymentmethod_id ใน backend
    //order_date?: string; // ฟิลด์ order_date
    payment_amount?: number;
    employee_id?: number; // ใช้แทน total_price
    promotion_type_id?: number;
}

