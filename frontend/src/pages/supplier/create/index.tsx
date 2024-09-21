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
  import { SupplierInterface } from "../../../interfaces/Supplier";
  import { CreateSupplier } from "../../../services/https";
  import { useNavigate, Link } from "react-router-dom";

  
  function SupplierCreate() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: SupplierInterface) => {
      let payload = {
        ...values,
      };
      console.log(payload);
      
      let res = await CreateSupplier(payload);
      if (res.status == 201) {
        messageApi.open({
          type: "success",
          content: "create supplier successfully",
        });
        setTimeout(function () {
          navigate("/supplier");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: "create supplier error",
        });
      }
    };

    useEffect(() => {
    }, []);
  
    return (
      <div>
        {contextHolder}
        <Card>
          <h2>เพิ่มข้อมูล ผู้ผลิต</h2>
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
                  name="name"
                  rules={[
                    { required: true, message: "กรุณากรอกชื่อผู้ผลิต !" },
                    { 
                      pattern: /^[a-zA-Z\sก-ฮา-์]*$/, // อนุญาตเฉพาะตัวอักษรภาษาอังกฤษและภาษาไทย พร้อมช่องว่าง
                      message: "กรุณากรอกชื่อที่มีแค่ตัวอักษรเท่านั้น !" 
                    },]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="ที่อยู่"
                  name="address"
                  rules={[
                    { required: true, message: "กรุณากรอกที่อยู่ผู้ผลิต !",},]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="เบอร์โทร"
                  name="tel"
                  rules={[
                    { required: true, message: "กรุณากรอกเบอร์ติดต่อผู้ผลิต !"},
                    { 
                      pattern: /^0[0-9]{9}$/, 
                      message: "กรุณากรอกเบอร์โทรศัพท์ที่มีแค่ตัวเลขและความยาวสิบเท่านั้น !" 
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
                    <Link to="/supplier">
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
  
  export default SupplierCreate;