import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Row,
  Col,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import { CreateEmployee } from "../../../services/https";
import { EmployeeInterface } from "../../../interfaces/Employee";
import { GenderInterface } from "../../../interfaces/Gender";
import { RoleInterface } from "../../../interfaces/Role";
import { GetGender,GetRole } from "../../../services/https";


const { Option } = Select;

function SignUpPages() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [role, setRole] = useState<RoleInterface[]>([]);
  const [gender, setGender] = useState<GenderInterface[]>([]);

  const onFinish = async (values: EmployeeInterface) => {
    let res = await CreateEmployee(values);

    if (res.status === 201) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getGender = async () => {
    let res = await GetGender();
    if (res.status === 200) {
      setGender(res.data);
    } else {
      setGender([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getRole = async () => {
    let res = await GetRole();
    if (res.status == 200) {
      setRole(res.data);
    } else {
      setRole([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getGender();
    getRole();
  }, []);

  return (
    <>
      {contextHolder}
      <Row justify="center" align="middle" className="login">
          <Card className="card-reg">
            <Row align={"middle"} justify={"center"}>
              <Col>
                <h2 className="front-1">Sign Up</h2>
                <Form
                  name="basic"
                  layout="vertical"
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  <Row gutter={[6, 6]} align={"middle"}>
                    <Col span={12} >
                      <Form.Item
                        label= {<span className="front-1">ชื่อจริง</span>}
                        name="first_name"
                        rules={[{ required: true, message: "กรุณากรอกชื่อ !" }]}
                      >
                        <Input className="front-1" placeholder="FirstName" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={<span className="front-1">นามสกุุล</span>}
                        name="last_name"
                        rules={[{ required: true, message: "กรุณากรอกนามสกุล !" }]}
                      >
                        <Input className="front-1" placeholder="LastName"/>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="gender"
                        label={<span className="front-1">เพศ</span>}
                        rules={[{ required: true, message: "กรุณาระบุเพศ !" }]}
                      >
                        <Select allowClear className="front-1" placeholder="Select gender">
                          {gender.map((item) => (
                            <Option className="front-1" value={item.ID} key={item.gender_name}>
                              {item.gender_name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={<span className="front-1">อีเมล</span>}
                        name="email"
                        rules={[
                          { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง !" },
                          { required: true, message: "กรุณากรอกอีเมล !" },
                        ]}
                      >
                        <Input className="front-1" placeholder="Gmail"/>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={<span className="front-1">Username</span>}
                        name="username"
                        rules={[{ required: true, message: "กรุณากรอก username !" }]}
                      >
                        <Input className="front-1" placeholder="Username"/>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={<span className="front-1">Password</span>}
                        name="password"
                        rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน !" }]}
                      >
                        <Input.Password className="front-1" placeholder="Password"/>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                    <Form.Item
                      name="role_id"
                      label={<span className="front-1">ตำแหน่งงาน</span>}
                      rules={[{ required: true, message: "กรุณาระบุเพศ !" }]}
                    >
                      <Select allowClear className="front-1" placeholder="Select role">
                        {role.map((item) => (
                          <Option className="front-1" value={item.ID} key={item.role_name}>
                            {item.role_name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                    <Col span={24}>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="login-form-button"
                          style={{ marginBottom: 20 }}
                        >
                          Sign up
                        </Button>
                        Or <a onClick={() => navigate("/")}>signin now !</a>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Card>
      </Row>
    </>
  );
}

export default SignUpPages;