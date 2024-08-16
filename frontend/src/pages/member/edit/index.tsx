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
import { MemberInterface } from "../../../interfaces/Member";
import { GetMemberById, UpdateMemberById } from "../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
import dayjs from "dayjs";

function MemberEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const getMemberById = async (id: string) => {
    let res = await GetMemberById(id);
    if (res.status == 200) {
      form.setFieldsValue({
        frist_name: res.data.frist_name,
        last_name: res.data.last_name,
        email: res.data.email,
        phone_number: res.data.phone_number,
        gender: res.data.gender,
        points: res.data.points,
        status: res.data.status,
        date_of_birth: dayjs(res.data.start_date),
        start_date: dayjs(res.data.start_date),
        end_date: dayjs(res.data.end_date),
      });
    } else {
      messageApi.open({
        type: "error",
        content: "error",
      });
      setTimeout(() => {
        navigate("/member");
      }, 2000);
    }
  };

  const onFinish = async (values: MemberInterface) => {
    let payload = {
      ...values,
    };

    const res = await UpdateMemberById(id, payload);
    if (res.status == 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/member");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    GetMemberById(id);
  }, []);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>แก้ไขข้อมูล สมาชิก</h2>
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
            
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
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
                      required: true,
                      message: "กรุณากรอกอีเมล !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="เบอร์โทรศัพท์"
                  name="phone_number"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกโทรศัพท์ !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
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
                    max={200}
                    defaultValue={0}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col> 
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="เพศ"
                name="gender"
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
                    { value: 1, label: "ชาย" },
                    { value: 2, label: "หญิง" },
                    { value: 3, label: "อื่นๆ" },
                  ]}
                />
              </Form.Item>
              </Col>
  
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="สถานะ"
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาเลือกสถานะ !",
                    },
                  ]}
                >
                  <Select
                  defaultValue=""
                  style={{ width: "100%" }}
                  options={[
                    { value: "", label: "กรุณาเลือกสถานะ", disabled: true },
                    { value: 1, label: "Active" },
                    { value: 2, label: "Inactive" },
                  ]}
                />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="วัน/เดือน/ปี เกิดของสมาชิก"
                  name="end_date"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาเลือกวัน/เดือน/ปี เกิดของสมาชิก !",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="วัน/เดือน/ปี เริ่มเป็นสมาชิก"
                  name="start_date"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาเลือกวัน/เดือน/ปี เริ่มเป็นสมาชิก !",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="วัน/เดือน/ปี ยกเลิกการเป็นสมาชิก"
                  name="end_date"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาเลือกวัน/เดือน/ปี ยกเลิกการเป็นสมาชิก !",
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
                  <Link to="/member">
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

export default MemberEdit;