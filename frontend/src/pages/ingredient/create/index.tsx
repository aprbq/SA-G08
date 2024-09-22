import { useEffect, useState } from "react";
import {
  Space,
  Button,
  Col,
  Row,
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
import { GetClass, CreateIngredients, GetUnits, GetSuppliers } from "../../../services/https";
import { useNavigate, Link } from "react-router-dom";
const { Option } = Select;

function IngredientsCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [classes, setClass] = useState<ClassInterface[]>([]); 
  const [unit, setUnit] = useState<UnitInterface[]>([]); 
  const [supplier, setSupplier] = useState<SupplierInterface[]>([]); 
  const [accountid, setAccountID] = useState<any>(localStorage.getItem("id"));
  const [form] = Form.useForm();
  const onFinish = async (values: IngredientInterface) => {
    let payload = {
      ...values,
      "employee_id": Number(accountid),
      quantity: Number(values.quantity),
      unit_price: Number(values.unit_price),
      price: Number(values.price),
    };
    console.log(payload);
    
    let res = await CreateIngredients(payload);
    if (res.status == 201) {
      messageApi.open({
        type: "success",
        content: "create successfully",
      });
      setTimeout(function () {
        navigate("/ingredient");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: "create error",
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
        content: "เกิดข้อผิดพลาด",
      });
    }
  };

  const getUnit = async () => {
    let res = await GetUnits();
    if (res.status == 200) {
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
    if (res.status == 200) {
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
    getClass();
    getUnit();
    getSuppliers();
  }, []);

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
                  {classes.map((item) => (
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
                label={<span className="front-1">ราคา</span>}
                name="price"
                rules={[{ required: true, message: "กรุณากรอกราคา !" }]}
              >
                <Input
                  min={0}
                  className="front-1"
                  type="number"
                  defaultValue={0}
                  style={{ width: "100%" }}
                  onChange={(e) => form.setFieldsValue({ price: e.target.value })}
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
                <DatePicker style={{ width: "100%" }} className="front-1" />
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

export default IngredientsCreate;
