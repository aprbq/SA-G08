import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Col, Row, Divider, Form, Select, Card, message, Input } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { PromotionInterface } from '../../../../interfaces/Promotion';
import { MenuInterface } from '../../../../interfaces/Menu';
import { MemberInterface } from '../../../../interfaces/Member';
import { OrdersweetInterface } from '../../../../interfaces/Ordersweet';
import { OrderItemInterface } from '../../../../interfaces/OrderItem';
import { PromotionTypeInterface } from '../../../../interfaces/Promotiontype';
import { PaymentmethodInterface } from '../../../../interfaces/Paymentmethod';
import { GetPromotion, GetPaymentMethods, CreateOrder, CreateOrderitem, GetPromotionType, GetCondition, GetMember ,UpdateMemberById} from '../../../../services/https';
import { OrderInterface } from '../../../../interfaces/Order';
import { PlusOutlined ,DeleteOutlined} from '@ant-design/icons';

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
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined); // เพิ่ม state สำหรับเบอร์โทรศัพท์
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

  const getMember = async (phoneNumber: string) => {
    try {
      const res = await GetMember(); // ดึงข้อมูลสมาชิก
      if (res.status === 200) {
        const members: MemberInterface[] = res.data; // กำหนดประเภทของ members
        const member = members.find((member: MemberInterface) => member.phone_number === phoneNumber);
        return member ? member.status_id !== 2 : false; // ตรวจสอบว่า status_id ไม่เท่ากับ 2
      } else {
        throw new Error('ไม่สามารถดึงข้อมูลสมาชิกได้');
      }
    } catch (error) {
      console.error("Error fetching members data:", error);
      return false;
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


  async function getMemberByPhoneNumber(phoneNumber: string): Promise<MemberInterface | null> {
    const memberRes = await GetMember(); // เรียก API หรือ Query ดึงข้อมูลสมาชิก
    const member = memberRes.data.find((m: MemberInterface) => m.phone_number === phoneNumber); 
    return member || null;
  }
  
  const onFinish = async (values: { promotion_id: number; payment_method_id: number; promotion_type_id: number }) => {
    // ตรวจสอบว่า phoneNumber เป็น string เสมอ ถ้า undefined ให้ใช้ค่า default เป็น ""
    const validPhoneNumber = phoneNumber || "";
  
    const isMemberValid = await getMember(validPhoneNumber); // ตรวจสอบเบอร์โทรศัพท์และสถานะสมาชิก
    
    // เช็ค promotion_type_id
    if (values.promotion_type_id === 1 && !isMemberValid) {
      messageApi.open({ type: "error", content: "เบอร์โทรศัพท์ไม่ถูกต้องหรือต้องห้ามการสั่งซื้อ!" });
      return;
    }
    
    // รวมราคารวมของทุก orderitem เป็นราคาสุทธิ
    let totalAmount = orderItems.reduce((total, item) => total + (item.total_item || 0), 0);
    let aftertotalAmount;
    
    // ตรวจสอบโปรโมชั่น
    const selectedPromotion = promotions.find(promo => promo.ID === values.promotion_id);
    
    if (selectedPromotion) {
      if (selectedPromotion.discount_type_id === 1) {
        const discountPercentage = selectedPromotion.discount_value || 0; 
        aftertotalAmount = totalAmount - totalAmount * (discountPercentage / 100); 
      } else if (selectedPromotion.discount_type_id === 2) {
        const discountAmount = selectedPromotion.discount_value || 0; 
        aftertotalAmount = totalAmount - discountAmount; 
      }
    }
  
    let updatedPoints = 0;
    let transacPoints = 0;
    let member_ID: number | undefined = undefined;
  
    if (isMemberValid) {
      // ดึงข้อมูลสมาชิกที่ตรงกับเบอร์โทรศัพท์
      const member = await getMemberByPhoneNumber(validPhoneNumber);
      
      if (member) {
        const memberID = member.ID?.toString(); // แปลง member.ID เป็น string ถ้ามีค่า
        member_ID = member.ID;
        console.log("naaa",memberID)
        if (!memberID) {
          messageApi.open({ type: "error", content: "ไม่สามารถดึงข้อมูลสมาชิกได้!" });
          return;
        }
      
        updatedPoints = member.points || 0; // ตั้งค่า point เดิมของสมาชิก
      
        // ตรวจสอบว่าแต้มที่มีพอสำหรับใช้หรือไม่
        if (selectedPromotion?.points_use && selectedPromotion.points_use !== 0) {
          if (updatedPoints < selectedPromotion.points_use) {
            messageApi.open({ type: "error", content: "แต้มสะสมไม่พอสำหรับการใช้โปรโมชั่นนี้!" });
            return;
          } else {
            
            updatedPoints -= selectedPromotion.points_use;
            transacPoints = selectedPromotion.points_use*(-1);
          }
        }
      
        // ถ้าโปรโมชั่นมี points_added ให้บวก point
        if (selectedPromotion?.points_added && selectedPromotion.points_added !== 0) {
          updatedPoints += selectedPromotion.points_added;
          transacPoints = selectedPromotion.points_added;
        }
  
        // อัพเดต point ของสมาชิกโดยส่ง ID ที่ดึงมา
        if(memberID){
          await UpdateMemberById(memberID ,{ points: updatedPoints });
        }
      }
    }

    const accountid = localStorage.getItem("id");
    const orderPayload: OrderInterface = {
      promotion_id: values.promotion_id,
      promotion_type_id: values.promotion_type_id,
      paymentmethod_id: values.payment_method_id,
      employee_id: Number(accountid),
      payment_amount: aftertotalAmount,
      payment_amount_before: totalAmount,
      order_date: new Date().toISOString(), // เก็บเวลาปัจจุบัน
      points_transactions: transacPoints,
      ...(member_ID !== undefined && { member_id: member_ID }),
      ...(values.promotion_type_id === 1 && { phone_number: validPhoneNumber }), // รวมเฉพาะ phone_number หาก promotion_type_id เท่ากับ 1
    };
    console.log("hee",orderPayload)
  
    try {
      const orderRes = await CreateOrder(orderPayload);
      if (orderRes && orderRes.status === 201) {
        const orderId = orderRes.data.data;
  
        await Promise.all(orderItems.map(async (item) => {
          const itemPayload = { ...item, order_id: orderId.ID };
          await CreateOrderitem(itemPayload);
        }));
  
        messageApi.open({ type: "success", content: "บันทึกข้อมูลออเดอร์สำเร็จ" });
  
        if (values.payment_method_id === 2) {
          navigate("/order/qrpage", { state: { totalAmount: aftertotalAmount, orderItems: orderItems, showQRCode: true } });
        } else {
          navigate("/order/qrpage", { state: { totalAmount: aftertotalAmount, orderItems: orderItems, showQRCode: false } });
        }
        
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
      <Card className='card-promotion'>
        <h2>ยืนยันการสั่งซื้อ</h2>
        <Divider />
        <Form layout="vertical" onFinish={onFinish}>
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="promotion_type_id"
                label={<span className="front-1">สำหรับ</span>}
                rules={[{ required: true, message: "กรุณาระบุสำหรับ !" }]}
              >
                <Select allowClear 
                  className="front-1"
                  onChange={handlePromotionTypeChange}>
                  {promotiontype.map((item) => (
                    <Option value={item.ID} key={item.promotion_type_name} className="front-1">
                      {item.promotion_type_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* เพิ่มช่องกรอกเบอร์โทรศัพท์ */}
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label={<span className="front-1">เบอร์โทรศัพท์</span>}
                name="phone_number"
                rules={[
                  {
                    message: 'กรุณากรอกเบอร์โทรศัพท์ !',
                  },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (10 หลัก)',
                  },
                ]}
              >
                <Input
                  className="front-1"
                  placeholder="กรอกเบอร์โทรศัพท์"
                  value={phoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label={<span className="front-1">โปรโมชั่น</span>}
                name="promotion_id"
                rules={[{ required: true, message: 'เลือกโปรโมชั่น !' }]}
              >
                <Select allowClear className="front-1">
                  {filteredPromotions.length > 0 ? (
                    filteredPromotions.map((item) => (
                      <Option value={item.ID} key={item.ID} className="front-1">
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
                label={<span className="front-1">ช่องทางการชำระเงิน</span>}
                name="payment_method_id"
                rules={[{ required: true, message: 'เลือกช่องทางการจ่ายเงิน !' }]}
              >
                <Select allowClear className="front-1">
                  {paymentMethods.map((item) => (
                    <Option value={item.ID} key={item.ID} className="front-1">
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
                  <Button 
                    className = "back-button"
                    type="primary" onClick={goToBackPage}>
                    ย้อนกลับ
                  </Button>
                  <Button 
                    className = "confirm-button"
                    type="primary" htmlType="submit">
                    ยืนยันออเดอร์
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Divider />
        <Table className="custom-table" 
          rowClassName={(record, index) => 
            index % 2 === 0 ? "table-row-light table-row-hover" : "table-row-dark table-row-hover"
          } columns={[
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
          // {
          //   title: 'โปรโมชั่น',
          //   dataIndex: 'promotion_id',
          //   key: 'promotion_id',
          //   render: (text: number) => {
          //     const promotionItem = promotions.find(item => item.ID === text);
          //     return promotionItem ? promotionItem.promotion_name : 'ไม่พบโปรโมชั่น';
          //   },
          // },
          {
            title: 'การจัดการ',
            key: 'action',
            render: (_: undefined, record: OrderItemInterface) => (
              <Button type="primary"
              className="btn-delete"
              icon={<DeleteOutlined />}onClick={() => removeOrderItem(record)}>
                
              </Button>
            ),
          },
        ]} dataSource={orderItems} rowKey="ID" />
      </Card>
    </div>
  );
}

export default OrderConfirm;
