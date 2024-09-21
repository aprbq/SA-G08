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
      <Card>
        <h2>แก้ไขข้อมูล ผู้ผลิต</h2>
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
                  label="ที่อยู่ผู้ผลิต"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกที่อยู่ผู้ผลิต !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
  
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
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
                  <Input />
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