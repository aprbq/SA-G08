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
  Upload,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { EmployeeInterface } from "../../../interfaces/Employee";
import { GenderInterface } from "../../../interfaces/Gender";
import { RoleInterface } from "../../../interfaces/Role";
import { CreateEmployee,GetGender,GetRole } from "../../../services/https";
import { useNavigate, Link } from "react-router-dom";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { Modal } from "antd";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const { Option } = Select;

function CustomerCreate() {
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();
  const [gender, setGender] = useState<GenderInterface[]>([]);
  const [role, setRole] = useState<RoleInterface[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);


  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };


  const onFinish = async (values: EmployeeInterface) => {

    let employeePayload = {
      ...values,
      "picture_employee": fileList[0]?.thumbUrl || "", // Ensure picture is either URL or empty string
    };

    let res = await CreateEmployee(employeePayload);

    if (res.status == 201) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(function () {
        navigate("/employee");
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
    <div>
      {contextHolder}
      <Card className="card-ingredient">
        <h2 className="front-1">เพิ่มข้อมูล ผู้ดูแลระบบ</h2>
        <Divider />

        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          className="front-1"
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>

          <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ textAlign: "center" }}>
              <Form.Item
                label={<span className="front-1">รูปพนักงาน</span>}
                name="picture_employee"
                valuePropName="fileList"
              >
                <ImgCrop rotationSlider>
                <Upload
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                  beforeUpload={(file) => {
                    setFileList([file]); // รับแค่ไฟล์เดียว
                    return false;
                  }}
                  maxCount={1}
                  multiple={false} // ปิดการอัพโหลดหลายไฟล์
                  listType="picture-card"
                >
                  {fileList.length < 1 && ( // ตรวจสอบว่ามีไฟล์อัพโหลดแล้วหรือไม่ ถ้ามีแล้วจะไม่แสดงปุ่มอัพโหลด
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}className="front-1">อัพโหลด</div>
                    </div>
                  )}
                </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label={<span className="front-1">ชื่อจริง</span>}
                      name="first_name"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอกชื่อ !",
                        },
                      ]}
                    >
                      <Input className="front-1" placeholder="First name"/>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label={<span className="front-1">นามสกุล</span>}
                      name="last_name"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอกนามสกุล !",
                        },
                      ]}
                    >
                      <Input className="front-1" placeholder="Last name"/>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      name="gender_id"
                      label={<span className="front-1">เพศ</span>}
                      rules={[{ required: true, message: "กรุณาระบุเพศ !" }]}
                    >
                      <Select allowClear className="front-1" placeholder="Select gender">
                        {gender.map((item) => (
                          <Option value={item.ID} key={item.gender_name} className="front-1">
                            {item.gender_name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      label={<span className="front-1">อีเมล</span>}
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
                      <Input className="front-1" placeholder="Email"/>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      label={<span className="front-1">Username</span>}
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอก username !",
                        },
                      ]}
                    >
                      <Input className="front-1" placeholder="Username"/>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      label={<span className="front-1">Password</span>}
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอกรหัสผ่าน !",
                        },
                      ]}
                    >
                      <Input.Password className="front-1" placeholder="Password"/>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label={<span className="front-1">ตำแหน่งงาน</span>}
                      name="role_id"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอกตำแหน่งงาน !",
                        },
                      ]}
                    >
                     <Select allowClear className="front-1" placeholder="Select role">
                        {role.map((item) => (
                          <Option value={item.ID} key={item.role_name} className="front-1">
                            {item.role_name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
          </Row>

          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Link to="/employee">
                    <Button htmlType="button" className="back-button" style={{ marginRight: "10px" }}>
                      ยกเลิก
                    </Button>
                  </Link>

                  <Button
                    type="primary"
                    htmlType="submit"
                    className="confirm-button"
                    icon={<PlusOutlined />}
                  >
                    ยืนยัน
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

export default CustomerCreate;