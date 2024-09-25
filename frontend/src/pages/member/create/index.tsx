import React, { useState, useEffect } from "react";
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
  import { MemberInterface } from "../../../interfaces/Member";
  import { StatusInterface } from "../../../interfaces/Status";
  // import { DiscountTypeInterface } from "../../../interfaces/Discounttype";
  // import { PromotionTypeInterface } from "../../../interfaces/Promotiontype";
  import { GenderInterface } from "../../../interfaces/Gender";
  import { CreateMember,GetStatus,GetGender } from "../../../services/https";
  import { useNavigate, Link } from "react-router-dom";


  const { Option } = Select;

  function MemberCreate() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [status, setStatus] = useState<StatusInterface[]>([]);
    // const [promotiontype, setPromotionType] = useState<PromotionTypeInterface[]>([]);
    // const [discounttype, setDiscountType] = useState<DiscountTypeInterface[]>([]);
    const [gender, setGender] = useState<GenderInterface[]>([]);

    const [accountid, setAccountID] = useState<any>(localStorage.getItem("id"));

    const onFinish = async (values: MemberInterface) => {
      let payload = {
        ...values,
        "employee_id": Number(accountid)
      }
      console.log(payload);
      let res = await CreateMember(payload);
      console.log(res);
      if (res) {
        messageApi.open({
          type: "success",
          content: "บันทึกข้อมูลสำเร็จ",
        });
        setTimeout(function () {
          navigate("/member");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: "เกิดข้อผิดพลาด !",
        });
      }
    };

    const getStatus = async () => {
      let res = await GetStatus();
    if (res.status == 200) {
      setStatus(res.data);
    } else {
      setStatus([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
    };

    const getGender = async () => {
      let res = await GetGender();
    if (res.status == 200) {
      setGender(res.data);
    } else {
      setGender([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
    };

    useEffect(() => {
      getStatus();
      getGender();
      console.log(accountid)
    }, []);
  
    return (
      <div>
        {contextHolder}
        <Card className="card-promotion">
          <h2>เพิ่มสมาชิก</h2>
          <Divider />
  
          <Form
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="ชื่อ"
                  name="frist_name"
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
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="นามสกุล"
                  name="last_name"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกนามสกุล !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="อีเมล"
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "รูปแบบอีเมลไม่ถูกต้อง !",
                  },
                  {
                    required: true,
                    message: "กรุณากรอกอีเมล !",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="เบอร์โทรศัพท์"
                name="phone_number"
                rules={[
                  { required: true, message: "กรุณากรอกเบอร์โทรศัพท์ !" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (10 หลัก)',
                  },
                ]}
                >
                  <Input />
                </Form.Item>
              </Col>


              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="แต้ม"
                  name="points"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกแต้ม !",
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


              
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="status_id"
                label="สถานะ"
                rules={[{ required: true, message: "กรุณาระบุสถานะ !" }]}
              >
                <Select allowClear>
                  {status.map((item) => (
                    <Option value={item.ID} key={item.status_name}>
                      {item.status_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="gender_id"
                label="เพศ"
                rules={[{ required: true, message: "กรุณาระบุเพศ !" }]}
              >
                <Select allowClear>
                  {gender.map((item) => (
                    <Option value={item.ID} key={item.gender_name}>
                      {item.gender_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="วัน/เดือน/ปี เกิด"
                name="date_of_birth"
                rules={[{ required: true, message: "กรุณาเลือกวัน/เดือน/ปี เกิด !" }]}
              >
              <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="วัน/เดือน/ปี สมัคร"
                name="start_date"
                rules={[{ required: true, message: "กรุณาเลือกวัน/เดือน/ปี สมัคร !" }]}
                >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="วัน/เดือน/ปี ยกเลิก"
                name="end_date"
                >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          
            <Row justify="end">
              <Col style={{ marginTop: "40px" }}>
                <Form.Item>
                  <Space>
                    <Link to="/member">
                      <Button className="back-button" htmlType="button" style={{ marginRight: "10px" }}>
                        ย้อนกลับ
                      </Button>
                    </Link>
  
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="confirm-button"
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
  
  export default MemberCreate;