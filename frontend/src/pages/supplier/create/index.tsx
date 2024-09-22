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
        <Row gutter={[16, 16]} justify="center" style={{ marginBottom: "20px" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <h1 className="heading-style">เพิ่มข้อมูลผู้ผลิต</h1>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Card className="card-style">
          <Form
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  label={<span className="front-1">ชื่อ</span>}
                  name="name"
                  rules={[
                    { required: true, message: "กรุณากรอกชื่อผู้ผลิต !" },
                    { 
                      pattern: /^[a-zA-Z\sก-ฮา-์]*$/, // อนุญาตเฉพาะตัวอักษรภาษาอังกฤษและภาษาไทย พร้อมช่องว่าง
                      message: "กรุณากรอกชื่อที่มีแค่ตัวอักษรเท่านั้น !" 
                    },]}
                >
                  <Input className="front-1"/>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  label={<span className="front-1">ที่อยู่ผู้ผลิต</span>}
                  name="address"
                  rules={[
                    { required: true, message: "กรุณากรอกที่อยู่ผู้ผลิต !",},]}
                >
                  <Input className="front-1"/>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  label={<span className="front-1">เบอร์โทร</span>}
                  name="tel"
                  rules={[
                    { required: true, message: "กรุณากรอกเบอร์ติดต่อผู้ผลิต !"},
                    { 
                      pattern: /^0[0-9]{9}$/, 
                      message: "กรุณากรอกเบอร์โทรศัพท์ที่มีแค่ตัวเลขและความยาวสิบเท่านั้น !" 
                    },
                  ]}
                >
                  <Input className="front-1"/>
                </Form.Item>
              </Col>

  
            <Row justify="center">
              <Col style={{ marginTop: "40px" }}>
                <Form.Item>
                  <Space>
                    <Link to="/supplier">
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
        </Row>
      </div>
    );
  }
  
  export default SupplierCreate;