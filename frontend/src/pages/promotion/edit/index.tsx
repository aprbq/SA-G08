import { useState,useEffect } from "react";
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
import { GetPromotionById, UpdatePromotionById,GetStatus,GetPromotionType,GetDiscountType } from "../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
const { Option } = Select;


function PromotionEdit() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [promotion, setPromotion] = useState<PromotionInterface>();
  const [status, setStatus] = useState<StatusInterface[]>([]);
  const [promotiontype, setPromotionType] = useState<PromotionTypeInterface[]>([]);
  const [discounttype, setDiscountType] = useState<DiscountTypeInterface[]>([]);

  let { id } = useParams();
  const [form] = Form.useForm();


  const onFinish = async (values: PromotionInterface) => {
    values.ID = promotion?.ID;
    let res = await UpdatePromotionById(values);
    if (res) {
      messageApi.open({
        type: "success",
        content: res.message,
      });
      setTimeout(function () {
        navigate("/promotion");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.message,
      });
    }
  };

  const getStatus = async () => {
    let res = await GetStatus();
    if (res) {
      setStatus(res);
    }
  };

  const getPromotionType = async () => {
    let res = await GetPromotionType();
    if (res) {
      setPromotionType(res);
    }
  };

  const getDiscountType = async () => {
    let res = await GetDiscountType();
    if (res) {
      setDiscountType(res);
    }
  };

  const getPromotionById = async () => {
    let res = await GetPromotionById(Number(id));
    if (res) {
      setPromotion(res);
      // set form ข้อมูลเริ่มของผู่้ใช้ที่เราแก้ไข
      form.setFieldsValue({
        promotion_name: res.data.promotion_name,
        description: res.data.description,
        points_added: res.data.points_added,
        points_use: res.data.points_use,
        discount_value: res.data.discount_value,
        discount_type_id: res.data.discount_type_id,
        promotion_type_id:res.data.promotion_type_id,
        status_id: res.data.status_id,
        start_date: dayjs(res.data.start_date),
        end_date: dayjs(res.data.end_date),
      });
    }
  };

  useEffect(() => {
    getStatus();
    getPromotionType();
    getDiscountType();
    getPromotionById();
  }, []);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>เพิ่มโปรโมชั่น</h2>
        <Divider />

        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
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

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
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

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
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

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
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

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
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

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
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

          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
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
            
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <Form.Item
              name="StatusID"
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

          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="วัน/เดือน/ปี เริ่มโปรโมชั่น"
                name="start_date"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกวัน/เดือน/ปี เริ่มโปรโมชั่น !",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
          </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="วัน/เดือน/ปี หมดโปรโมชั่น"
                name="end_date"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกวัน/เดือน/ปี หมดโปรโมชั่น !",
                  },
                ]}
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
                    <Button htmlType="button" style={{ marginRight: "10px" }}>
                      ย้อนกลับ
                    </Button>
                  </Link>

                  <Button
                    type="primary"
                    htmlType="submit"
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