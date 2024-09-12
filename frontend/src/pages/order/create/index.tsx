import React, { useState, useEffect } from "react";
import {
    Space,
    Button,
    Col,
    Row,
    Divider,
    Form,
    Input,
    Card,
    message,
    InputNumber,
    Select,
  } from "antd";
  import { PlusOutlined } from "@ant-design/icons";
  import { OrderItemInterface } from "../../../interfaces/OrderItem";
  import { OrdersweetInterface } from "../../../interfaces/Ordersweet";
  //import { DiscountTypeInterface } from "../../../interfaces/Discounttype";
  //import { PromotionTypeInterface } from "../../../interfaces/Promotiontype";
  import { MenuInterface } from "../../../interfaces/Menu";
  import { CreateOrderitem,GetOrdersweet,GetMenu } from "../../../services/https";
  import { useNavigate, Link } from "react-router-dom";


  const { Option } = Select;

  function OrderitemCreate() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    // const [status, setStatus] = useState<StatusInterface[]>([]);
    // const [promotiontype, setPromotionType] = useState<PromotionTypeInterface[]>([]);
    // const [discounttype, setDiscountType] = useState<DiscountTypeInterface[]>([]);
    const [menu, setMenu] = useState<MenuInterface[]>([]);
    const [ordersweet, setOrdersweet] = useState<OrdersweetInterface[]>([]);


    const [accountid, setAccountID] = useState<any>(localStorage.getItem("id"));

    const onFinish = async (values: OrderItemInterface) => {
      let payload = {
        ...values,
        "employee_id": Number(accountid)
      }
      console.log(payload);
      let res = await CreateOrderitem(values);
      console.log(res);
      if (res) {
        messageApi.open({
          type: "success",
          content: "บันทึกข้อมูลสำเร็จ",
        });
        setTimeout(function () {
          navigate("/order");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: "เกิดข้อผิดพลาด !",
        });
      }
    };

    // const getStatus = async () => {
    //   let res = await GetStatus();
    // if (res.status == 200) {
    //   setStatus(res.data);
    // } else {
    //   setStatus([]);
    //   messageApi.open({
    //     type: "error",
    //     content: res.data.error,
    //   });
    // }
    // };

    // const getPromotionType = async () => {
    //   let res = await GetPromotionType();
    //   if (res.status == 200) {
    //     setPromotionType(res.data);
    //   } else {
    //     setPromotionType([]);
    //     messageApi.open({
    //       type: "error",
    //       content: res.data.error,
    //     });
    //   }
    // };

    // const getDiscountType = async () => {
    //   let res = await GetDiscountType();
    // if (res.status == 200) {
    //   setDiscountType(res.data);
    // } else {
    //   setDiscountType([]);
    //   messageApi.open({
    //     type: "error",
    //     content: res.data.error,
    //   });
    // }
    // };

    const getMenu = async () => {
      let res = await GetMenu();
    if (res.status == 200) {
      setMenu(res.data);
    } else {
      setMenu([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
    };

    const getOrdersweet = async () => {
      let res = await GetOrdersweet();
    if (res.status == 200) {
      setOrdersweet(res.data);
    } else {
      setOrdersweet([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
    };


    useEffect(() => {
      // getStatus();
      // getPromotionType();
      // getDiscountType();
      getMenu();
      getOrdersweet();
      console.log(accountid)
    }, []);
  
    return (
      <div>
        {contextHolder}
        <Card>
          <h2>เพิ่มรายการสั่งซื้อ</h2>
          <Divider />
  
          <Form
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
          <Row gutter={[16, 0]}>
            

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="จำนวน"
                  name="order_quantity"
                  rules={[
                    {
                      required: true,
                      message: "ระบุจำนวน !",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    max={99}
                    defaultValue={0}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="ราคารวมของรายการ"
                  name="total_item"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกจำนวน !",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    max={9999}
                    defaultValue={0}
                    style={{ width: "100%" }}
                    step={0.01} 
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="ordersweet_id"
                label="ระดับความหวาน"
                rules={[{ required: true, message: "ระบุความหวาน !" }]}
              >
                <Select allowClear>
                  {ordersweet.map((item) => (
                    <Option value={item.ID} key={item.order_sweet_name}>
                      {item.order_sweet_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            
              
            

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="menu_id"
                label="ชื่อเมนู"
                rules={[{ required: true, message: "เลือกเมนู !" }]}
              >
                <Select allowClear>
                  {menu.map((item) => (
                    <Option value={item.ID} key={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            
          </Row>
          
            <Row justify="end">
              <Col style={{ marginTop: "40px" }}>
                <Form.Item>
                  <Space>
                    <Link to="/order">
                      <Button className="back-button" htmlType="button" style={{ marginRight: "10px" }}>
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
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }
  
  export default OrderitemCreate;