import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Col, Row, Divider, Form, Select, Card, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PromotionInterface } from '../../../../interfaces/Promotion';
import { MenuInterface } from '../../../../interfaces/Menu';
import { OrdersweetInterface } from '../../../../interfaces/Ordersweet';
import { OrderItemInterface } from '../../../../interfaces/OrderItem';
import { PaymentmethodInterface } from '../../../../interfaces/Paymentmethod';
import { GetPromotion, GetPaymentMethods, CreateOrder } from '../../../../services/https';
import { OrderInterface } from '../../../../interfaces/Order';

const { Option } = Select;

function OrderConfirm() {
  const [messageApi, contextHolder] = message.useMessage();
  const [promotions, setPromotions] = useState<PromotionInterface[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentmethodInterface[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<number | undefined>(undefined);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | undefined>(undefined);
  const [orderItems, setOrderItems] = useState<OrderItemInterface[]>([]);
  const [menu, setMenu] = useState<MenuInterface[]>([]);
  const [ordersweet, setOrdersweet] = useState<OrdersweetInterface[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const getPromotions = async () => {
    try {
      let res = await GetPromotion();
      if (res.status === 200) {
        setPromotions(res.data);
      } else {
        setPromotions([]);
        messageApi.open({
          type: 'error',
          content: 'ไม่สามารถดึงข้อมูลโปรโมชั่นได้',
        });
      }
    } catch (error) {
      console.error("Error fetching promotions data:", error);
    }
  };

  const getPaymentMethods = async () => {
    try {
      let res = await GetPaymentMethods();
      if (res.status === 200) {
        setPaymentMethods(res.data);
      } else {
        setPaymentMethods([]);
        messageApi.open({
          type: 'error',
          content: 'ไม่สามารถดึงข้อมูลช่องทางการจ่ายเงินได้',
        });
      }
    } catch (error) {
      console.error("Error fetching payment methods data:", error);
    }
  };

  const saveOrder = async () => {
    // คำนวณราคาทั้งหมดสำหรับออเดอร์
    const total_price = orderItems.reduce((total, item) => total + (item.total_item || 0), 0);
  
    // ตรวจสอบให้แน่ใจว่า orderItems ไม่ว่างเปล่า
    if (orderItems.length === 0) {
      messageApi.open({
        type: 'error',
        content: 'กรุณาเพิ่มรายการในออเดอร์ก่อนทำการบันทึก',
      });
      return;
    }
  
    // สร้างข้อมูลออเดอร์
    const orderData: OrderInterface = {
      ID: 0, // ใช้ค่าตัวอย่างหรือตั้งค่า ID ให้เหมาะสม
      name: "Order Name", // ตั้งชื่อออเดอร์
      promotion_id: selectedPromotion,
      payment_method_id: selectedPaymentMethod,
      orderItems: orderItems,
      order_date: new Date().toISOString(), // ใช้วันที่ปัจจุบัน
      total_price: total_price, // คำนวณราคาทั้งหมด
    };
  
    console.log("Order Data:", orderData); // ตรวจสอบข้อมูลที่ส่งไป
  
    try {
      const orderResponse = await CreateOrder(orderData);
      console.log("API Response:", orderResponse); // ตรวจสอบข้อมูลที่ตอบกลับ
      if (orderResponse.status === 200) {
        messageApi.open({
          type: 'success',
          content: 'บันทึกออเดอร์สำเร็จ',
        });
        navigate('/order'); // นำทางไปยังหน้า Order หลังจากการบันทึกสำเร็จ
      } else {
        messageApi.open({
          type: 'error',
          content: 'ไม่สามารถบันทึกออเดอร์ได้',
        });
      }
    } catch (error) {
      console.error("Error saving order:", error);
      messageApi.open({
        type: 'error',
        content: 'เกิดข้อผิดพลาดในการบันทึกออเดอร์',
      });
    }
  };
  

  useEffect(() => {
    if (location.state) {
      const { orderItems, menu, ordersweet } = location.state;
      setOrderItems(orderItems);
      setMenu(menu);
      setOrdersweet(ordersweet);
    }
    getPromotions();
    getPaymentMethods();
  }, [location.state]);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>ยืนยันการสั่งซื้อ</h2>
        <Divider />
        <Form layout="vertical">
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="โปรโมชั่น"
                name="promotion_id"
                rules={[{ required: true, message: 'เลือกโปรโมชั่น !' }]}
              >
                <Select allowClear onChange={(value) => setSelectedPromotion(value)}>
                  {promotions.map((item) => (
                    <Option value={item.ID} key={item.ID}>
                      {item.promotion_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="ช่องทางการจ่ายเงิน"
                name="payment_method_id"
                rules={[{ required: true, message: 'เลือกช่องทางการจ่ายเงิน !' }]}
              >
                <Select allowClear onChange={(value) => setSelectedPaymentMethod(value)}>
                  {paymentMethods.map((item) => (
                    <Option value={item.ID} key={item.ID}>
                      {item.payment_method}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col style={{ marginTop: '40px' }}>
              <Form.Item>
                <Space>
                  <Link to="/order/create">
                    <Button className="back-button" htmlType="button" style={{ marginRight: '10px' }}>
                      ย้อนกลับ
                    </Button>
                  </Link>
                  <Button
                    type="primary"
                    onClick={saveOrder}
                  >
                    ยืนยันออเดอร์
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Divider />
        <Table columns={[
          {
            title: 'ชื่อเมนู',
            dataIndex: 'menu_id',
            key: 'menu_id',
            render: (text: number) => {
              const menuItem = menu.find(item => item.ID === text);
              return menuItem ? menuItem.name : 'ไม่พบเมนู';
            },
          },
          {
            title: 'จำนวน',
            dataIndex: 'order_quantity',
            key: 'order_quantity',
          },
          {
            title: 'ราคาของเมนู',
            dataIndex: 'total_item',
            key: 'total_item',
            render: (text: number) => `${text} บาท`,
          },
          {
            title: 'ระดับความหวาน',
            dataIndex: 'ordersweet_id',
            key: 'ordersweet_id',
            render: (text: number) => {
              const sweetItem = ordersweet.find(item => item.ID === text);
              return sweetItem ? sweetItem.order_sweet_name : 'ไม่พบระดับความหวาน';
            },
          },
        ]} dataSource={orderItems} rowKey="ID" />
      </Card>
    </div>
  );
}

export default OrderConfirm;
