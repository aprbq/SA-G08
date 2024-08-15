import { useEffect } from "react";
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
import { GetPromotionById, UpdatePromotionById } from "../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
import dayjs from "dayjs";

function PromotionEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const getPromotionById = async (id: string) => {
    let res = await GetPromotionById(id);
    if (res.status == 200) {
      form.setFieldsValue({
        promotion_name: res.data.promotion_name,
        description: res.data.description,
        points_added: res.data.points_added,
        points_use: res.data.points_use,
        discount_value: res.data.discount_value,
        discount_type: res.data.discount_type,
        status: res.data.status,
        start_date: dayjs(res.data.start_date),
        end_date: dayjs(res.data.end_date),
        condition_id: res.data.condition?.ID,
      });
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลวัตถุดิบ",
      });
      setTimeout(() => {
        navigate("/promotion");
      }, 2000);
    }
  };

  const onFinish = async (values: PromotionInterface) => {
    let payload = {
      ...values,
    };

    const res = await UpdatePromotionById(id, payload);
    if (res.status == 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/promotion");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getPromotionById(id);
  }, []);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>แก้ไขข้อมูล โปรโมชั่น</h2>
        <Divider />

        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="ชื่อ"
                  name="name"
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
                label="ประเภท"
                name="discount_type"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกประเภท !",
                  },
                ]}
              >
                <Select
                  defaultValue=""
                  style={{ width: "100%" }}
                  options={[
                    { value: "", label: "กรุณาเลือกประเภท", disabled: true },
                    { value: 1, label: "Percent" },
                    { value: 2, label: "BOGO" },
                    { value: 3, label: "Bath" },
                  ]}
                />
              </Form.Item>
              </Col>
  
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="สถานะ"
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาเลือกสถานะ !",
                    },
                  ]}
                >
                  <Select
                  defaultValue=""
                  style={{ width: "100%" }}
                  options={[
                    { value: "", label: "กรุณาเลือกสถานะ", disabled: true },
                    { value: 1, label: "Active" },
                    { value: 2, label: "Inactive" },
                  ]}
                />
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