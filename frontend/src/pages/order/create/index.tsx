import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Col, Row, Divider, Form, InputNumber, Select, Card, message, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { MenuInterface } from '../../../interfaces/Menu';
import { OrdersweetInterface } from '../../../interfaces/Ordersweet';
import { OrderItemInterface } from '../../../interfaces/OrderItem';
import { Link, useNavigate } from 'react-router-dom';
import { GetMenu, GetOrdersweet, CreateOrder, CreateOrderitem } from '../../../services/https';

const { Option } = Select;

function OrderitemCreate() {
  const [messageApi, contextHolder] = message.useMessage();
  const [menu, setMenu] = useState<MenuInterface[]>([]);
  const [ordersweet, setOrdersweet] = useState<OrdersweetInterface[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItemInterface[]>([]);
  const [selectedMenuPrice, setSelectedMenuPrice] = useState<number>(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const addOrderItem = (values: OrderItemInterface) => {
    // ตรวจสอบและแปลงค่า order_quantity เป็น number
    const quantity = values.order_quantity ? Number(values.order_quantity) : 0;
    // ตรวจสอบว่า selectedMenuPrice มีค่าเป็น number หรือไม่
    const price = selectedMenuPrice || 0;
    // คำนวณ totalItem
    const totalItem = quantity * price;

    const newOrderItem: OrderItemInterface = {
      ...values,
      total_item: totalItem,
    };

    // เพิ่มรายการใหม่ใน orderItems
    const newOrderItems = [...orderItems, newOrderItem];
    setOrderItems(newOrderItems);

    // แสดงข้อความสำเร็จ
    messageApi.open({
      type: 'success',
      content: 'เพิ่มรายการสำเร็จ',
    });
  };

  const onFinish = (values: OrderItemInterface) => {
    addOrderItem(values);
    form.resetFields(); // รีเซ็ตฟอร์มหลังจากส่งข้อมูล
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

  const saveOrder = async () => {
    try {
      let orderData = { /* ข้อมูลที่คุณต้องการส่งไปยัง CreateOrder */ };
      const orderResponse = await CreateOrder(orderData);
      if (orderResponse.status === 200) {
        const orderId = orderResponse.data.ID;

        for (const item of orderItems) {
          await CreateOrderitem({ ...item, order_id: orderId });
        }

        messageApi.open({
          type: 'success',
          content: 'บันทึกออเดอร์สำเร็จ',
        });

        navigate('/order');
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
    getMenu();
    getOrdersweet();
  }, []);

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
  ];

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
                      ย้อนกลับ
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
        <Table columns={columns} dataSource={orderItems} rowKey="ID" />
      </Card>
    </div>
  );
}

export default OrderitemCreate;
