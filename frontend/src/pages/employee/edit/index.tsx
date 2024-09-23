import { useEffect,useState } from "react";
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
  Select,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { EmployeeInterface } from "../../../interfaces/Employee";
import { GenderInterface } from "../../../interfaces/Gender";
import { RoleInterface } from "../../../interfaces/Role";
import { GetEmployeeById, UpdateEmployeeById,GetGender,GetRole  } from "../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const { Option } = Select;

function CustomerEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [gender, setGender] = useState<GenderInterface[]>([]);
  const [role, setRole] = useState<RoleInterface[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  const getEmployeeById = async (id: string) => {
    let res = await GetEmployeeById(id);
    if (res.status == 200) {
      form.setFieldsValue({
        first_name: res.data.first_name,
        last_name: res.data.last_name,
        picture_employee: res.data.picture_employee,
        email: res.data.email,
        gender_id: res.data.gender?.ID,
        role_id: res.data.role?.ID,
      });
      if (res.data.picture_employee) {
        setFileList([
          {
            uid: '-1', // Unique ID สำหรับไฟล์
            name: 'profile.png', // ชื่อไฟล์
            status: 'done', // สถานะของไฟล์
            url: res.data.picture_employee, // URL ของรูปที่โหลดมา
          },
        ]);
      }
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลผู้ใช้",
      });
      setTimeout(() => {
        navigate("/employee");
      }, 2000);
    }
  };

  
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
    let payload = {
      ...values,
    };

    const res = await UpdateEmployeeById(id, payload);
    if (res.status == 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
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
    getEmployeeById(id);
    getRole();
    getGender();
  }, []);

  return (
    <div>
      {contextHolder}
      <Card className="card-ingredient">
        <h2>เพิ่มข้อมูล ผู้ดูแลระบบ</h2>
        <Divider />

        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          form = {form}
        >
          <Row gutter={[16, 0]}>

          <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ textAlign: "center" }}>
              <Form.Item
                label="รูปเมนู"
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
                  multiple={false}
                  listType="picture-card"
                >
                  {fileList.length < 1 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>อัพโหลด</div>
                    </div>
                  )}
                </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="ชื่อจริง"
                      name="first_name"
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

                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="นามกสุล"
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
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
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

                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      label="Username"
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอก username !",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      label="รหัสผ่าน"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอกรหัสผ่าน !",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="ตำแหน่งงาน"
                      name="role_id"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอกตำแหน่งงาน !",
                        },
                      ]}
                    >
                     <Select allowClear>
                        {role.map((item) => (
                          <Option value={item.ID} key={item.role_name}>
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
                    <Button htmlType="button" style={{ marginRight: "10px" }}>
                      ยกเลิก
                    </Button>
                  </Link>

                  <Button
                    type="primary"
                    htmlType="submit"
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

export default CustomerEdit;
