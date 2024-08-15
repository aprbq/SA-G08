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
import { MenuInterface } from "../../../interfaces/Menu";
import { GetMenuById, UpdateMenuById } from "../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
import dayjs from "dayjs";

function MenuEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const getMenuById = async (id: string) => {
    let res = await GetMenuById(id);
    if (res.status == 200) {
      form.setFieldsValue({
        name: res.data.name,
        quantity: res.data.quantity,
       
        price: res.data.price,
        
        category_id: res.data.category?.ID,
      });
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลวัตถุดิบ",
      });
      setTimeout(() => {
        navigate("/menus");
      }, 2000);
    }
  };

  const onFinish = async (values: MenuInterface) => {
    let payload = {
      ...values,
    };

    const res = await UpdateMenuById(id, payload);
    if (res.status == 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/menus");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getMenuById(id);
  }, []);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>แก้ไขข้อมูลเมนู</h2>
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
                label="ประเภท"
                name="category_id"
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
                    { value: 1, label: "Hot" },
                    { value: 2, label: "Ice" },
                    { value: 3, label: "Frappe" },
                    
                  ]}
                />
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
  
              {/* <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="หน่วย"
                  name="unit"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกหน่วย !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
  
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="ราคาต่อหน่วย"
                  name="unit_price"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกราคาต่อหน่วย !",
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
              </Col> */}
              
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="ราคา"
                  name="price"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกราคา !",
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

              {/* <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="ผู้ผลิต"
                  name="supplier"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกชื่อผู้ผลิต !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="วัน/เดือน/ปี หมดอายุ"
                  name="exp"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาเลือกวัน/เดือน/ปี หมดอายุ !",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col> */}
          </Row>

          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Link to="/menus">
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

export default MenuEdit;