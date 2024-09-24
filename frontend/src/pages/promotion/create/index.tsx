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
    DatePicker,
    Select,
  } from "antd";
  import { PlusOutlined } from "@ant-design/icons";
  import { PromotionInterface } from "../../../interfaces/Promotion";
  import { StatusInterface } from "../../../interfaces/Status";
  import { DiscountTypeInterface } from "../../../interfaces/Discounttype";
  import { PromotionTypeInterface } from "../../../interfaces/Promotiontype";
  import { MenuInterface } from "../../../interfaces/Menu";
  import { CreatePromotion,GetStatus,GetDiscountType,GetPromotionType,GetMenu,CreateCondition } from "../../../services/https";
  import { useNavigate, Link } from "react-router-dom";


  const { Option } = Select;

  function PromotionCreate() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [status, setStatus] = useState<StatusInterface[]>([]);
    const [promotiontype, setPromotionType] = useState<PromotionTypeInterface[]>([]);
    const [discounttype, setDiscountType] = useState<DiscountTypeInterface[]>([]);
    const [menu, setMenu] = useState<MenuInterface[]>([]);
    const [isBogo, setIsBogo] = useState(false);
    const [accountid, setAccountID] = useState<any>(localStorage.getItem("id"));
    const [form] = Form.useForm();

    const onFinish = async (values: PromotionInterface) => {
      let payload = {
        ...values,
        "employee_id": Number(accountid),
        "points_added": Number(values.points_added),
        "points_use": Number(values.points_use),
        "discount_value": Number(values.discount_value),
        "menu_ids": values.menu_id, // ส่งค่า menu_id ที่เป็น array
      };
    
      console.log(payload);
      
      try {
        // สร้างโปรโมชั่น
        let res = await CreatePromotion(payload);
        console.log('CreatePromotion response:', res);
        console.log('pay response:', payload);
      
        if (res && res.status === 201) {
          // ดึง ID ของโปรโมชั่นหากต้องใช้ในการสร้างเงื่อนไข
          const promotionId = res.data.data;
          
          // เตรียมข้อมูลเงื่อนไขหากจำเป็น
          const conditionPayload = {
            promotion_id: promotionId,
            menu_ids: values.menu_id // ส่งค่า menu_id ที่เป็น array
          };
      
          // สร้างเงื่อนไข
          let res1 = await CreateCondition(conditionPayload);
          if (res1 && res1.status === 201) {
            messageApi.open({
              type: "success",
              content: "บันทึกข้อมูลสำเร็จ",
            });
            setTimeout(() => {
              navigate("/promotion");
            }, 2000);
          } else {
            throw new Error(res1.data.error || "ไม่สามารถสร้างเงื่อนไขได้");
          }
        } else {
          throw new Error(res.data.error || "ไม่สามารถสร้างโปรโมชั่นได้");
        }
      } catch (error) {
        // ตรวจสอบประเภทของข้อผิดพลาด
        let errorMessage = "เกิดข้อผิดพลาด !";
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
      
        messageApi.open({
          type: "error",
          content: errorMessage,
        });
      }
    };

    const getStatus = async () => {
      let res = await GetStatus();
    if (res.status == 200) {
      setStatus(res.data);
    } else {
      setStatus([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
    };

    const getPromotionType = async () => {
      let res = await GetPromotionType();
      if (res.status == 200) {
        setPromotionType(res.data);
      } else {
        setPromotionType([]);
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    };

    const getDiscountType = async () => {
      let res = await GetDiscountType();
    if (res.status == 200) {
      setDiscountType(res.data);
    } else {
      setDiscountType([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
    };

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


    useEffect(() => {
      getStatus();
      getPromotionType();
      getDiscountType();
      getMenu();
      console.log(accountid)
    }, []);
  
    return (
      <div>
        {contextHolder}
        <Card className="card-promotion">
          <h2 className="name-table">เพิ่มโปรโมชั่น</h2>
          <Divider />
  
          <Form
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            initialValues={{
              points_added: 0,
              points_use: 0,
              discount_value: 0,
            }}

          >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label={<span className="front-1">ชื่อ</span>}
                  name="promotion_name"
                  rules={[
                    {
                      required: true,
                      message: <span className="error-front">กรุณากรอกชื่อ !</span>
                    },
                  ]}
                >
                  <Input className="front-1" placeholder="Name"/>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label={<span className="front-1">คำอธิบาย</span>}
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: <span className="error-front">กรุณากรอกคำอธิบาย !</span>
                    },
                  ]}
                >
                  <Input className="front-1" placeholder="Description"/>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label={<span className="front-1">ได้แต้ม</span>}
                  name="points_added"
                  rules={[
                    {
                      required: true,
                      message: <span className="error-front">กรุณากรอกแต้ม !</span>
                    },
                  ]}
                >
                  <Input
                    className="front-1"
                    min={0}
                    type="number"
                    defaultValue={0}
                    style={{ width: "100%" }}
                    onChange={(e) => form.setFieldsValue({ points_added: e.target.value })}
                />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label={<span className="front-1">ใช้แต้ม</span>}
                  name="points_use"
                  rules={[
                    {
                      required: true,
                      message: <span className="error-front">กรุณากรอกแต้ม !</span>
                    },
                  ]}
                >
                  <Input
                    className="front-1"
                    min={0}
                    type="number"
                    defaultValue={0}
                    style={{ width: "100%" }}
                    onChange={(e) => form.setFieldsValue({ points_use: e.target.value })}
                />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label={<span className="front-1">ส่วนลด</span>}
                  name="discount_value"
                  rules={[
                    {
                      required: true,
                      message: <span className="error-front">กรุณากรอกส่วนลด !</span>
                    },
                  ]}
                >
                  <Input
                    className="front-1"
                    min={0}
                    type="number"
                    defaultValue={0}
                    style={{ width: "100%" }}
                    onChange={(e) => form.setFieldsValue({ discount_value: e.target.value })}
                />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="discount_type_id"
                label={<span className="front-1">ประเภทส่วนลด</span>}
                rules={[{ required: true, message: <span className="error-front">กรุณาระบุประเภทส่วนลด !</span> }]}
              >
                <Select allowClear className="front-1" placeholder="Select type">
                  {discounttype.map((item) => (
                    <Option value={item.ID} key={item.discount_type_name} className="front-1">
                      {item.discount_type_name}
                    </Option>
                  ))}
                </Select >
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="promotion_type_id"
                label={<span className="front-1">สำหรับ</span>}
                rules={[{ required: true, message: <span className="error-front">กรุณาระบุประเภท !</span> }]}
              >
                <Select allowClear className="front-1" placeholder="Select type">
                  {promotiontype.map((item) => (
                    <Option value={item.ID} key={item.ID} className="front-1">
                      {item.promotion_type_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
              
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="status_id"
                label={<span className="front-1">สถานะ</span>}
                rules={[{ required: true, message: <span className="error-front">กรุณากรอกสถานะ !</span> }]}
              >
                <Select allowClear className="front-1" placeholder="Select status">
                  {status.map((item) => (
                    <Option value={item.ID} key={item.status_name} className="front-1">
                      {item.status_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item name="menu_id" label={<span className="front-1">เมนูสำหรับโปรโมชั่น</span>} 
                  rules={[{ required: true,message: <span className="error-front">กรุณาระบุเมนู !</span> }]}>
              <Select mode="multiple" placeholder="Select menus" className="front-1">
                {menu.map((menu) => (
                <Option key={menu.ID} value={menu.ID} className="front-1">
                  {menu.name}
                </Option>
                ))}
              </Select>
              </Form.Item>
            </Col>  
            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
              <Form.Item
                label={<span className="front-1">วัน/เดือน/ปี เริ่มโปรโมชั่น</span>}
                name="start_date"
                rules={[{ required: true, 
                  message: <span className="error-front">กรุณาวันเริ่มโปรโมชั่น !</span> }]}
              >
                <DatePicker style={{ width: "100%" }} className="front-1" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <Form.Item
                  label={<span className="front-1">วัน/เดือน/ปี หมดโปรโมชั่น</span>}
                  name="end_date"
                  rules={[
                    { 
                      required: true, 
                      message: <span className="error-front">กรุณาวันหมดโปรโมชั่น !</span> 
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || !getFieldValue('start_date') || value.isAfter(getFieldValue('start_date'))) {
                          return Promise.resolve();
                        }
                        return Promise.reject(<span className="error-front">วันหมดโปรโมชั่นต้องมากกว่าวันเริ่มโปรโมชั่น!</span>);
                      },
                    }),
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} className="front-1" />
                </Form.Item>
            </Col>
          </Row>
          
            <Row justify="end">
              <Col style={{ marginTop: "40px" }}>
                <Form.Item>
                  <Space>
                    <Link to="/promotion">
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
  
  export default PromotionCreate;