import { useEffect, useState } from "react";
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
import { IngredientInterface } from "../../../interfaces/Ingredient";
import { ClassInterface } from "../../../interfaces/ClassInterface";
import { GetClass, GetIngredientsById, UpdateIngredientsById } from "../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
import dayjs from "dayjs";

const { Option } = Select;

function IngredientEdit() {
  const navigate = useNavigate();
  //let { id } = useParams();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [Class, setClass] = useState<ClassInterface[]>([]);
  const [form] = Form.useForm();

  const getIngredientsById = async (id: string | undefined) => {
    let res = await GetIngredientsById(id);
    if (res.status == 200) {
      form.setFieldsValue({
        name: res.data.name,
        quantity: res.data.quantity,
        unit: res.data.unit,
        unit_price: res.data.unit_price,
        price: res.data.price,
        supplier: res.data.supplier,
        exp_date: dayjs(res.data.exp_date),
        class_id: res.data.class?.ID,
      });
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลวัตถุดิบ",
      });
      setTimeout(() => {
        navigate("/ingredient");
      }, 2000);
    }
  };

  const onFinish = async (values: IngredientInterface) => {
    let payload = {
      ...values,
    };
    console.log(payload)
    const res = await UpdateIngredientsById(id, values);
    if (res.status == 200) {
      messageApi.open({
        type: "success",
        content: "update successsfully",
      });
      setTimeout(() => {
        navigate("/ingredient");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: "error update",
      });
    }
  };

  const getClass = async () => {
    let res = await GetClass();
    if (res.status == 200) {
      setClass(res.data);
    } else {
      setClass([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getIngredientsById(id);
    getClass();
  }, [id]);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>แก้ไขข้อมูล วัตถุดิบ</h2>
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
                name="class_id"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกประเภท !",
                  },
                ]}
              >
                <Select allowClear>
                  {Class.map((item) => (
                    <Option value={item.ID} key={item.class}>
                      {item.class}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="จำนวน"
                  name="quantity"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกจำนวน !",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    defaultValue={0}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
  
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
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
                    defaultValue={0}
                    style={{ width: "100%" }}
                    step={0.01} 
                  />
                </Form.Item>
              </Col>
              
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
                    defaultValue={0}
                    style={{ width: "100%" }}
                    step={0.01} 
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
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
                  name="exp_date"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาเลือกวัน/เดือน/ปี หมดอายุ !",
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

export default IngredientEdit;