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
  import { CreatePromotion } from "../../../services/https";
  import { useNavigate, Link } from "react-router-dom";
  
  function IngredientsCreate() {
    const navigate = useNavigate();
  
    const [messageApi, contextHolder] = message.useMessage();
  
    const onFinish = async (values: PromotionInterface) => {
  
      let res = await CreatePromotion(values);
     
      if (res.status == 201) {
        messageApi.open({
          type: "success",
          content: res.data.message,
        });
        setTimeout(function () {
          navigate("/promotion");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    };
  
    return (
      <div>
        {contextHolder}
        <Card>
          <h2>เพิ่มโปรโมชั่น</h2>
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
                <Select
                  defaultValue=""
                  style={{ width: "100%" }}
                  options={[
                    { value: "", label: "กรุณาเลือกประเภท", disabled: true },
                    { value: 1, label: "Milk" },
                    { value: 2, label: "Tea" },
                    { value: 3, label: "Coffee" },
                    { value: 4, label: "Syrups" },
                  ]}
                />
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
                    max={99}
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
                    max={9999}
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
                    max={9999}
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
  
  export default IngredientsCreate;