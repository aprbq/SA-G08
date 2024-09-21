import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Col, Row, Divider, Form, InputNumber, Select, Card, message, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { MenuInterface } from '../../../interfaces/Menu';
import { OrdersweetInterface } from '../../../interfaces/Ordersweet';
import { OrderItemInterface } from '../../../interfaces/OrderItem';
import { PromotionInterface } from '../../../interfaces/Promotion';
import { PromotionTypeInterface } from '../../../interfaces/Promotiontype';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GetMenu, GetOrdersweet, GetPromotion } from '../../../services/https';

const { Option } = Select;

function OrderitemCreate() {
  const [messageApi, contextHolder] = message.useMessage();
  const [menu, setMenu] = useState<MenuInterface[]>([]);
  const [ordersweet, setOrdersweet] = useState<OrdersweetInterface[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItemInterface[]>([]);
  // const [promotiontype, setPromotiontype] = useState<PromotionTypeInterface[]>([]);
  const [selectedMenuPrice, setSelectedMenuPrice] = useState<number>(0);
  const location = useLocation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  // สถานะสำหรับโปรโมชั่น
  const [promotions, setPromotions] = useState<PromotionInterface[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<PromotionInterface[]>([]);

  const addOrderItem = (values: OrderItemInterface) => {
    const quantity = values.order_quantity ? Number(values.order_quantity) : 0;
    const price = selectedMenuPrice || 0;
    const totalItem = quantity * price;

    const newOrderItem: OrderItemInterface = {
      ...values,
      total_item: totalItem,
    };

    setOrderItems([...orderItems, newOrderItem]);

    messageApi.open({
      type: 'success',
      content: 'เพิ่มรายการสำเร็จ',
    });
  };

  const onFinish = (values: OrderItemInterface) => {
    addOrderItem(values);
    form.resetFields();
  };

  const handleMenuChange = (menu_id: number) => {
    const selectedMenu = menu.find((item) => item.ID === menu_id);
    if (selectedMenu) {
      setSelectedMenuPrice(selectedMenu.price ?? 0);
    }
  };

  const getMenu = async () => {
    try {
      let res = await GetMenu();
      if (res.status === 200) {
        setMenu(res.data);
      } else {
        setMenu([]);
        messageApi.open({
          type: 'error',
          content: 'ไม่สามารถดึงข้อมูลเมนูได้',
        });
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  const getOrdersweet = async () => {
    try {
      let res = await GetOrdersweet();
      if (res.status === 200) {
        setOrdersweet(res.data);
      } else {
        setOrdersweet([]);
        messageApi.open({
          type: 'error',
          content: 'ไม่สามารถดึงข้อมูลระดับความหวานได้',
        });
      }
    } catch (error) {
      console.error("Error fetching ordersweet data:", error);
    }
  };

  const getPromotions = async () => {
    // ฟังก์ชันเพื่อดึงโปรโมชั่น
    try {
      let res = await GetPromotion(); // เพิ่มฟังก์ชันที่ดึงโปรโมชั่น
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

  useEffect(() => {
    if (location.state) {
      const { orderItems, menu, ordersweet } = location.state;
      setOrderItems(orderItems); // นำ orderItems กลับมาใช้
      setMenu(menu);
      setOrdersweet(ordersweet);
    }
    getOrdersweet();
    getMenu();
    getPromotions(); // เรียกใช้เพื่อดึงข้อมูลโปรโมชั่น
  }, [location.state]);

  const columns = [
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
      title: 'การจัดการ',
      key: 'action',
      render: (_: undefined, record: OrderItemInterface) => (
        <Button type="link" onClick={() => removeOrderItem(record)}>
          ยกเลิก
        </Button>
      ),
    },
  ];

  const removeOrderItem = (itemToRemove: OrderItemInterface) => {
    const updatedOrderItems = orderItems.filter(item => item !== itemToRemove);
    setOrderItems(updatedOrderItems);
  
    messageApi.open({
      type: 'success',
      content: 'ยกเลิกรายการสำเร็จ',
    });
  };

  const getPromotionsForMenu = (menuId: number) => {
    return promotions.filter(promotion => 
      promotion.menu?.includes(menuId) && promotion.promotion_type_id === 1 // เปลี่ยน 1 เป็น promotion_type_id ที่ต้องการ
    );
  };

  const goToNextPage = () => {
    const selectedMenuId = orderItems[0]?.menu_id; // หรือดึงจากข้อมูลที่ต้องการ
    if (selectedMenuId) {
      const promotionsForMenu = getPromotionsForMenu(selectedMenuId);
      setFilteredPromotions(promotionsForMenu); // ตั้งค่าโปรโมชั่นที่กรองแล้ว

      navigate('/order/create/createorder', {
        state: {
          orderItems,
          menu,
          ordersweet,
          promotions: promotionsForMenu // ส่งโปรโมชั่นที่กรองแล้วไปด้วย
        },
      });
    } else {
      messageApi.open({
        type: 'warning',
        content: 'กรุณาเลือกเมนูก่อน',
      });
    }
  };

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>เพิ่มรายการสั่งซื้อ</h2>
        <Divider />
        <Form form={form} name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="menu_id"
                label="ชื่อเมนู"
                rules={[{ required: true, message: 'เลือกเมนู !' }]}
              >
                <Select allowClear onChange={handleMenuChange}>
                  {menu.map((item) => (
                    <Option value={item.ID} key={item.ID}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item label="ราคาของเมนู">
                <Input value={selectedMenuPrice ? `${selectedMenuPrice} บาท` : ''} readOnly />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="จำนวน"
                name="order_quantity"
                rules={[{ required: true, message: 'ระบุจำนวน !' }]}
              >
                <InputNumber min={0} max={99} defaultValue={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="ระดับความหวาน"
                name="ordersweet_id"
                rules={[{ required: true, message: 'ระบุความหวาน !' }]}
              >
                <Select allowClear>
                  {ordersweet.map((item) => (
                    <Option value={item.ID} key={item.ID}>
                      {item.order_sweet_name}
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
                  <Link to="/order">
                    <Button className="back-button" htmlType="button" style={{ marginRight: '10px' }}>
                      ยกเลิก
                    </Button>
                  </Link>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="confirm-button"
                    icon={<PlusOutlined />}
                  >
                    ตกลง
                  </Button>
                  <Button
                    type="primary"
                    onClick={goToNextPage}
                  >
                    ไปยังหน้าถัดไป
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Divider />
        <Table columns={columns} dataSource={orderItems} rowKey="ID" />
      </Card>
    </div>
  );
}

export default OrderitemCreate;
