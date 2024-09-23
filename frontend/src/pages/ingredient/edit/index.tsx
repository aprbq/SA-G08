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
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IngredientInterface } from "../../../interfaces/Ingredient";
import { ClassInterface } from "../../../interfaces/ClassInterface";
import { SupplierInterface } from "../../../interfaces/Supplier";
import { UnitInterface } from "../../../interfaces/Unit";
import { GetClass, GetIngredientsById, UpdateIngredientsById, GetSuppliers, GetUnits } from "../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import moment from 'moment';

const { Option } = Select;

function IngredientEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [Class, setClass] = useState<ClassInterface[]>([]);
  const [unit, setUnit] = useState<UnitInterface[]>([]); 
  const [supplier, setSupplier] = useState<SupplierInterface[]>([]); 
  const [form] = Form.useForm();

  const getIngredientsById = async (id: string) => {
    let res = await GetIngredientsById(id);
    if (res.status === 200) {
      form.setFieldsValue({
        name: res.data.name,
        quantity: res.data.quantity,
        unit_id: res.data.unit_id,
        unit_price: res.data.unit_price,
        price: res.data.price,
        suppliers_id: res.data.suppliers_id,
        exp_date: dayjs(res.data.exp_date),
        class_id: res.data.class_id,
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
    // Convert string inputs to numbers
    const price = Number(values.quantity) * Number(values.unit_price);
    const payload = {
      ...values,
      quantity: Number(values.quantity),
      unit_price: Number(values.unit_price),
      price: price,
    };
    console.log(payload);
    const res = await UpdateIngredientsById(id, payload);
    if (res.status === 200) {
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
    if (res.status === 200) {
      setClass(res.data);
    } else {
      setClass([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getUnit = async () => {
    let res = await GetUnits();
    if (res.status === 200) {
      setUnit(res.data);
    } else {
      setUnit([]);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด",
      });
    }
  };

  const getSuppliers = async () => {
    let res = await GetSuppliers();
    if (res.status === 200) {
      setSupplier(res.data);
    } else {
      setSupplier([]);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด",
      });
    }
  };

  useEffect(() => {
    getIngredientsById(id);
    getClass();
    getUnit();
    getSuppliers();
  }, [id]);

  return (
    <div>
      {contextHolder}
      <Row gutter={[16, 16]} justify="center" style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <h1 className="heading-style">แก้ไขข้อมูลวัตถุดิบ</h1>
        </Col>
      </Row>
      <Card className="card-ingredient">
        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 16]} justify="center" style={{ marginTop: "0px" }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span className="front-1">ชื่อ</span>}
                name="name"
                rules={[{ required: true, message: "กรุณากรอกชื่อ !" }]}
              >
                <Input className="front-1" />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span className="front-1">ประเภท</span>}
                name="class_id"
                rules={[{ required: true, message: "กรุณาเลือกประเภท !" }]}
              >
                <Select className="front-1" allowClear>
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
                label={<span className="front-1">จำนวน</span>}
                name="quantity"
                rules={[{ required: true, message: "กรุณากรอกจำนวน !" }]}
              >
                <Input
                  className="front-1"
                  min={0}
                  type="number"
                  defaultValue={0}
                  style={{ width: "100%" }}
                  onChange={(e) => form.setFieldsValue({ quantity: e.target.value })}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span className="front-1">หน่วย</span>}
                name="unit_id"
                rules={[{ required: true, message: "กรุณากรอกหน่วย !" }]}
              >
                <Select className="front-1" allowClear>
                  {unit.map((item) => (
                    <Option value={item.ID} key={item.ID}>
                      {item.unit}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span className="front-1">ราคาต่อหน่วย</span>}
                name="unit_price"
                rules={[{ required: true, message: "กรุณากรอกราคาต่อหน่วย !" }]}
              >
                <Input
                  min={0}
                  className="front-1"
                  type="number"
                  defaultValue={0}
                  style={{ width: "100%" }}
                  onChange={(e) => form.setFieldsValue({ unit_price: e.target.value })}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span className="front-1">ผู้ผลิต</span>}
                name="suppliers_id"
                rules={[{ required: true, message: "กรุณากรอกชื่อผู้ผลิต !" }]}
              >
                <Select className="front-1" allowClear>
                  {supplier.map((item) => (
                    <Option value={item.ID} key={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span className="front-1">วันหมดอายุ</span>}
                name="exp_date"
                rules={[{ required: true, message: "กรุณาเลือกวัน/เดือน/ปี หมดอายุ !" }]}
              >
                <DatePicker
                  className="front-1"
                  disabledDate={(current) => current && current < moment().startOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="center">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Link to="/ingredient">
                    <Button htmlType="button" className="front-1" style={{ marginRight: "10px" }}>
                      ย้อนกลับ
                    </Button>
                  </Link>

                  <Button
                    type="primary"
                    className="button-ok"
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
