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
    InputNumber,
    Select,
  } from "antd";
  import { PlusOutlined } from "@ant-design/icons";
  import { PromotionInterface } from "../../../interfaces/Promotion";
  import { StatusInterface } from "../../../interfaces/Status";
  import { DiscountTypeInterface } from "../../../interfaces/Discounttype";
  import { PromotionTypeInterface } from "../../../interfaces/Promotiontype";
  import { MenuInterface } from "../../../interfaces/Menu";
  import { ConditionInterface } from "../../../interfaces/Condition";
  import { GetCondition,GetStatus,GetDiscountType,GetPromotionType,GetMenu,GetPromotionById, UpdatePromotionById } from "../../../services/https";
  import { useNavigate, Link, useParams } from "react-router-dom";
  import dayjs from "dayjs";


  const { Option } = Select;

  function PromotionEdit() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: any }>();
    const [messageApi, contextHolder] = message.useMessage();
    const [status, setStatus] = useState<StatusInterface[]>([]);
    const [promotiontype, setPromotionType] = useState<PromotionTypeInterface[]>([]);
    const [discounttype, setDiscountType] = useState<DiscountTypeInterface[]>([]);
    const [menu, setMenu] = useState<MenuInterface[]>([]);
    const [condition, setCondition] = useState<ConditionInterface[]>([]);
    const [promotion, setPromotion] = useState<PromotionInterface[]>([]);

    const [form] = Form.useForm();
    const getPromotionById = async (id: string) => {
      let res = await GetPromotionById(id);
      if (res.status === 200) {
        setPromotion(res.data);
        form.setFieldsValue({
          promotion_name: res.data.promotion_name,
          description: res.data.description,
          start_date: dayjs(res.data.start_date),
          end_date: dayjs(res.data.end_date),
          points_added: res.data.points_added,
          points_use: res.data.points_use,
          discount_value: res.data.discount_value,
          discount_type_id: res.data.discount_type_id,
          promotion_type_id: res.data.promotion_type_id,
          status_id: res.data.status_id,
          menu_id: res.data.conditions ? res.data.conditions.map((condition: any) => condition.menuID) : [],
        });
      } else {
        messageApi.open({
          type: "error",
          content: "ไม่พบข้อมูล",
        });
        setTimeout(() => {
          navigate("/promotion");
        }, 2000);
      }
    };

    const onFinish = async (values: PromotionInterface) => {
      let payload = {
        ...values,
      }
      console.log(payload);
      let res = await UpdatePromotionById(id,values);
      console.log(res);
      if (res) {
        messageApi.open({
          type: "success",
          content: "บันทึกข้อมูลสำเร็จ",
        });
        setTimeout(function () {
          navigate("/promotion");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: "เกิดข้อผิดพลาด !",
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
      console.log("API Response for Menu:", res);
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

    const getCondition = async () => {
      let res = await GetCondition();
      console.log("API Response for Menu:", res);
    if (res.status == 200) {
      setCondition(res.data);
    } else {
      setCondition([]);
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
      getCondition();
      getPromotionById(id);
    }, [id]);
  
    return (
      <div>
        {contextHolder}
        <Card>
          <h2>เพิ่มโปรโมชั่น</h2>
          <Divider />
  
          <Form
            name="basic"
            layout="vertical"
            form={form}
            onFinish={onFinish}
            autoComplete="off"
          >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="ชื่อ"
                  name="promotion_name"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกชื่อ !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="คำอธิบาย"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกคำอธิบาย !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="ได้แต้ม"
                  name="points_added"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกแต้ม !",
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
                  label="ใช้แต้ม"
                  name="points_use"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกแต้ม !",
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
                  label="จำนวน"
                  name="discount_value"
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
                name="discount_type_id"
                label="ประเภทส่วนลด"
                rules={[{ required: true, message: "กรุณาระบุประเภทส่วนลด !" }]}
              >
                <Select allowClear>
                  {discounttype.map((item) => (
                    <Option value={item.ID} key={item.discount_type_name}>
                      {item.discount_type_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="promotion_type_id"
                label="สำหรับ"
                rules={[{ required: true, message: "กรุณาระบุสำหรับ !" }]}
              >
                <Select allowClear>
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
                name="status_id"
                label="สถานะ"
                rules={[{ required: true, message: "กรุณาระบุสถานะ !" }]}
              >
                <Select allowClear>
                  {status.map((item) => (
                    <Option value={item.ID} key={item.status_name}>
                      {item.status_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item name="menu_id" label="Menus" rules={[{ required: true }]}>
              <Select mode="multiple" placeholder="Select menus">
                {menu.map((menu) => (
                <Option key={menu.ID} value={menu.name}>
                  {menu.name}
                </Option>
                ))}
              </Select>
              </Form.Item>
            </Col>  
            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
              <Form.Item
                label="วัน/เดือน/ปี เริ่มโปรโมชั่น"
                name="start_date"
                rules={[{ required: true, message: "กรุณาเลือกวัน/เดือน/ปี เริ่มโปรโมชั่น !" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
              <Form.Item
                label="วัน/เดือน/ปี หมดโปรโมชั่น"
                name="end_date"
                rules={[{ required: true, message: "กรุณาเลือกวัน/เดือน/ปี หมดโปรโมชั่น !" }]}
              >
                <DatePicker style={{ width: "100%" }} />
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
  
  export default PromotionEdit;