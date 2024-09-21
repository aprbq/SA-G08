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
import { SupplierInterface } from "../../../interfaces/Supplier";
import { GetSupplierById, UpdateSupplierById } from "../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";


function IngredientEdit() {
  const navigate = useNavigate();
  //let { id } = useParams();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [supplier, setSupplier] = useState<SupplierInterface[]>([]);
  const [form] = Form.useForm();

  const getSupplierById = async (id: string) => {
    let res = await GetSupplierById(id);
    if (res.status == 200) {
      form.setFieldsValue({
        name: res.data.name,
        address: res.data.address,
        tel: res.data.tel,
      });
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลวัตถุดิบ",
      });
      setTimeout(() => {
        navigate("/supplier");
      }, 2000);
    }
  };

  const onFinish = async (values: SupplierInterface) => {
    let payload = {
      ...values,
    };
    console.log(payload)
    const res = await UpdateSupplierById(id, values);
    if (res.status == 200) {
      messageApi.open({
        type: "success",
        content: "update successsfully",
      });
      setTimeout(() => {
        navigate("/supplier");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: "error update",
      });
    }
  };


  useEffect(() => {
    getSupplierById(id);
  }, [id]);

  return (
    <div>
      {contextHolder}
      <Row gutter={[16, 16]} justify="center" style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <h1 className="heading-style">แก้ไขข้อมูลผู้ผลิต</h1>
        </Col>
      </Row>

      <Row gutter={[16, 16]} justify="center" style={{ marginTop: "0px" }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card className="card-style">
            <Form
              name="basic"
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Row gutter={[16, 10]} >
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      className="front-1"
                      label="ชื่อ"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอกชื่อ !",
                        },
                      ]}
                    >
                      <Input className="front-1"/>
                    </Form.Item>
                  </Col>
                  
              </Row>

                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="ที่อยู่ผู้ผลิต"
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอกที่อยู่ผู้ผลิต !",
                        },
                      ]}
                    >
                      <Input className="front-1"/>
                    </Form.Item>
                  </Col>
      
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="เบอร์โทร"
                      name="tel"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอกเบอร์โทร !",
                        },
                      ]}
                    >
                      <Input className="front-1"/>
                    </Form.Item>
                  </Col>
              <Row justify="space-between">
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
                        className="front-1"
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
      </Col>
      </Row>
    </div>
  );
}

export default IngredientEdit;