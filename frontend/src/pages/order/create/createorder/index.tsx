import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Col, Row, Divider, Form, Select, Card, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { PromotionInterface } from '../../../../interfaces/Promotion';
import { MenuInterface } from '../../../../interfaces/Menu';
import { OrdersweetInterface } from '../../../../interfaces/Ordersweet';
import { OrderItemInterface } from '../../../../interfaces/OrderItem';
import { PromotionTypeInterface } from '../../../../interfaces/Promotiontype';
import { PaymentmethodInterface } from '../../../../interfaces/Paymentmethod';
import { GetPromotion, GetPaymentMethods, CreateOrder, CreateOrderitem, GetPromotionType, GetCondition } from '../../../../services/https';
import { OrderInterface } from '../../../../interfaces/Order';

const { Option } = Select;

function OrderConfirm() {
  const [messageApi, contextHolder] = message.useMessage();
  const [promotions, setPromotions] = useState<PromotionInterface[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentmethodInterface[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItemInterface[]>([]);
  const [menu, setMenu] = useState<MenuInterface[]>([]);
  const [promotiontype, setPromotionType] = useState<PromotionTypeInterface[]>([]);
  const [ordersweet, setOrdersweet] = useState<OrdersweetInterface[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<PromotionInterface[]>([]);
  const [conditions, setConditions] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPromotionType, setSelectedPromotionType] = useState<number | undefined>(undefined);

  const getPromotions = async () => {
    try {
      let res = await GetPromotion();
      if (res.status === 200) {
        setPromotions(res.data);
      } else {
        setPromotions([]);
        messageApi.open({ type: 'error', content: 'ไม่สามารถดึงข้อมูลโปรโมชั่นได้' });
      }
    } catch (error) {
      console.error("Error fetching promotions data:", error);
    }
  };

  const getConditions = async () => {
    try {
      let res = await GetCondition();
      if (res.status === 200) {
        setConditions(res.data);
      } else {
        setConditions([]);
        messageApi.open({ type: 'error', content: 'ไม่สามารถดึงข้อมูลเงื่อนไขได้' });
      }
    } catch (error) {
      console.error("Error fetching conditions data:", error);
    }
  };

  const getPromotionType = async () => {
    let res = await GetPromotionType();
    if (res.status == 200) {
      setPromotionType(res.data);
    } else {
      setPromotionType([]);
      messageApi.open({ type: "error", content: res.data.error });
    }
  };

  const goToBackPage = () => {
    navigate('/order/create', {
      state: {
        orderItems,
        menu,
        ordersweet
      },
    });
  };

  const getPromotionsForAllMenus = (menuIds: number[], promotionTypeId: number) => {
    return promotions.filter(promotion => 
      promotion.promotion_type_id === promotionTypeId && // ต้องตรงกับประเภทโปรโมชั่น
      conditions.some(condition => 
        menuIds.includes(condition.menu_id) && condition.promotion_id === promotion.ID // เช็คว่า menu_id ใด ๆ ในเงื่อนไขตรงกับ promotion_id
      ) &&
      promotion.status_id !== 2 // เพิ่มเงื่อนไขให้ตรวจสอบ status_id ว่าไม่ใช่ Unactive
    );
  };

  const removeOrderItem = (itemToRemove: OrderItemInterface) => {
    const updatedOrderItems = orderItems.filter(item => item !== itemToRemove);
    setOrderItems(updatedOrderItems);
    localStorage.setItem("orderItems", JSON.stringify(updatedOrderItems));
    messageApi.open({ type: 'success', content: 'ยกเลิกรายการสำเร็จ' });
  };

  const getPaymentMethods = async () => {
    try {
      let res = await GetPaymentMethods();
      if (res.status === 200) {
        setPaymentMethods(res.data);
      } else {
        setPaymentMethods([]);
        messageApi.open({ type: 'error', content: 'ไม่สามารถดึงข้อมูลช่องทางการจ่ายเงินได้' });
      }
    } catch (error) {
      console.error("Error fetching payment methods data:", error);
    }
  };

  const getPromotionsForMenu = (menuIds: number[], promotionTypeId: number) => {
    return promotions.filter(promotion => 
      promotion.promotion_type_id === promotionTypeId && // ต้องตรงกับประเภทโปรโมชั่น
      conditions.some(condition => 
        menuIds.includes(condition.menu_id) && condition.promotion_id === promotion.ID // เช็คว่า menu_id ใด ๆ ในเงื่อนไขตรงกับ promotion_id
      )&& 
      promotion.status_id !== 2 // เช็ค menu_id กับ promotion_id
    );
  };
  
  const handlePromotionTypeChange = (promotionTypeId: number) => {
    setSelectedPromotionType(promotionTypeId);

    // ดึง menu_id ของทุกเมนูจาก orderItems
    const selectedMenuIds = orderItems.map(item => item.menu_id).filter((id): id is number => id !== undefined);

    if (selectedMenuIds.length > 0) {
      // กรองโปรโมชั่นสำหรับเมนูทั้งหมด
      const promotionsForMenus = getPromotionsForAllMenus(selectedMenuIds, promotionTypeId);
      console.log("Filtered Promotions for all menus:", promotionsForMenus); // Debugging line
      setFilteredPromotions(promotionsForMenus);
    } else {
      setFilteredPromotions([]);
    }
  };
  

  const onFinish = async (values: { promotion_id: number; payment_method_id: number; promotion_type_id: number }) => {
    const accountid = localStorage.getItem("id");
    const orderPayload: OrderInterface = {
      promotion_id: values.promotion_id,
      promotion_type_id: values.promotion_type_id,
      paymentmethod_id: values.payment_method_id,
      employee_id: Number(accountid),
      payment_amount: orderItems.reduce((total, item) => total + (item.total_item || 0), 0),
    };
    try {
      const orderRes = await CreateOrder(orderPayload);
      if (orderRes && orderRes.status === 201) {
        const orderId = orderRes.data.data;

        await Promise.all(orderItems.map(async (item) => {
          const itemPayload = { ...item, order_id: orderId.ID };
          await CreateOrderitem(itemPayload);
        }));

        messageApi.open({ type: "success", content: "บันทึกข้อมูลออเดอร์สำเร็จ" });
        setTimeout(() => navigate("/order"), 2000);
      } else {
        throw new Error(orderRes.data.error || "ไม่สามารถสร้างออเดอร์ได้");
      }
    } catch (error) {
      messageApi.open({ type: "error", content: error instanceof Error ? error.message : "เกิดข้อผิดพลาด !" });
    }
  };

  useEffect(() => {
    const storedOrderItems = localStorage.getItem("orderItems");
    if (storedOrderItems) {
      setOrderItems(JSON.parse(storedOrderItems));
    }

    if (location.state) {
      const { orderItems, menu, ordersweet } = location.state;
      setOrderItems(orderItems);
      setMenu(menu);
      setOrdersweet(ordersweet);
      localStorage.setItem("orderItems", JSON.stringify(orderItems));
    }

    getPromotions();
    getPaymentMethods();
    getPromotionType();
    getConditions();
  }, [location.state]);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>ยืนยันการสั่งซื้อ</h2>
        <Divider />
        <Form layout="vertical" onFinish={onFinish}>
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="promotion_type_id"
                label="สำหรับ"
                rules={[{ required: true, message: "กรุณาระบุสำหรับ !" }]}
              >
                <Select allowClear onChange={handlePromotionTypeChange}>
                  {promotiontype.map((item) => (
                    <Option value={item.ID} key={item.promotion_type_name}>
                      {item.promotion_type_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Form.Item
              label="โปรโมชั่น"
              name="promotion_id"
              rules={[{ required: true, message: 'เลือกโปรโมชั่น !' }]}
            >
              <Select allowClear>
                {filteredPromotions.length > 0 ? (
                  filteredPromotions.map((item) => (
                    <Option value={item.ID} key={item.ID}>
                      {item.promotion_name} {/* แสดงชื่อโปรโมชั่น */}
                    </Option>
                  ))
                ) : (
                  <Option disabled key="no-promotions">ไม่มีโปรโมชั่นที่เลือก</Option>
                )}
              </Select>
            </Form.Item>

            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="ช่องทางการจ่ายเงิน"
                name="payment_method_id"
                rules={[{ required: true, message: 'เลือกช่องทางการจ่ายเงิน !' }]}
              >
                <Select allowClear>
                  {paymentMethods.map((item) => (
                    <Option value={item.ID} key={item.ID}>
                      {item.payment_methods}
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
                  <Button type="primary" onClick={goToBackPage}>
                    ย้อนกลับ
                  </Button>
                  <Button type="primary" htmlType="submit">
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
          {
            title: 'โปรโมชั่น',
            dataIndex: 'promotion_id',
            key: 'promotion_id',
            render: (text: number) => {
              const promotionItem = promotions.find(item => item.ID === text);
              return promotionItem ? promotionItem.promotion_name : 'ไม่พบโปรโมชั่น';
            },
          },
          {
            title: 'การจัดการ',
            key: 'action',
            render: (_: undefined, record: OrderItemInterface) => (
              <Button type="link" onClick={() => removeOrderItem(record)}>
                ยกเลิก
              </Button>
            ),
          },
        ]} dataSource={orderItems} rowKey="ID" />
      </Card>
    </div>
  );
}

export default OrderConfirm;
