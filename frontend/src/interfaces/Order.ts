export interface OrderInterface {
    ID?: number; // ฟิลด์ ID
    promotion_id?: number; // ฟิลด์ promotion_id ใน backend
    paymentmethod_id?: number; // ฟิลด์ paymentmethod_id ใน backend
    order_date?: string; // ฟิลด์ order_date
    payment_amount?: number;
    employee_id?: number;
    promotion_type_id?: number;
    payment_amount_before?: number;
    member_id?: number;
    points_transactions?: number;
}
