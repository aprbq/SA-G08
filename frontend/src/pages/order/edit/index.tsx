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
import { OrderInterface } from "../../../interfaces/Order";
import { GetOrderById, UpdateOrderById } from "../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
import dayjs from "dayjs";

function OrderEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const getOrderById = async (id: string) => {
    let res = await GetOrderById(id);
    if (res.status == 200) {
      form.setFieldsValue({
        order_name: res.data.order_name,
        order_quantity: res.data.order_quantity,
        sugar: res.data.sugar,
        order_id: res.data.order?.ID,
      });
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลวัตถุดิบ",
      });
      setTimeout(() => {
        navigate("/order");
      }, 2000);
    }
  };

  const onFinish = async (values: OrderInterface) => {
    let payload = {
      ...values,
    };

    const res = await UpdateOrderById(id, payload);
    if (res.status == 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/order");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getOrderById(id);
  }, []);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>แก้ไขรายการสั่งซื้อ</h2>
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
              label="รายชื่อเมนู"
              name="order_name"
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือกเมนู !",
                },
              ]}
            >
              <Select
                defaultValue=""
                style={{ width: "100%" }}
                options={[
                  { value: "", label: "กรุณาเลือกเมนู", disabled: true },
                  { value: 1, label: "ชาเขียว" },
                  { value: 2, label: "ลาเต้" },
                  { value: 3, label: "ชาไทย" },
                  { value: 4, label: "นมสด" },
                ]}
              />
            </Form.Item>
            </Col>
              
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <Form.Item
              label="ประเภท"
              name="class_order"
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
                  { value: 1, label: "ร้อน" },
                  { value: 2, label: "ปั่น" },
                  { value: 3, label: "เย็น" },
                  
                ]}
              />
            </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="จำนวน"
                name="order_quantity"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกจำนวน !",
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
              label="ความหวาน"
              name="sugar"
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือกระดับความหวาน !",
                },
              ]}
            >
              <Select
                defaultValue=""
                style={{ width: "100%" }}
                options={[
                  { value: "", label: "กรุณาเลือกความหวาน", disabled: true },
                  { value: 1, label: "หวานน้อย" },
                  { value: 2, label: "หวานปกติ" },
                  { value: 3, label: "เพิ่มหวาน" },
                  
                ]}
              />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Link to="/ingredient">
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

export default OrderEdit;