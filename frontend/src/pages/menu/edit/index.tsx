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
  InputNumber,
  Select,
  Upload,
} from "antd";
import { PlusOutlined, UploadOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { MenuInterface } from "../../../interfaces/Menu";
import { GetMenuById, UpdateMenuById } from "../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";

function MenuEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<any[]>([]);

  const getMenuById = async (id: string) => {
    let res = await GetMenuById(id);
    if (res.status == 200) {
      form.setFieldsValue({
        name: res.data.name,
        price: res.data.price,
        description: res.data.description,
        category_id: res.data.category?.ID,
        ingredients: res.data.ingredients || [], // Set ingredients from API
      });

      if (res.data.image) {
        setImageFile([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: res.data.image,
          },
        ]);
      }
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลเมนู",
      });
      setTimeout(() => {
        navigate("/menus");
      }, 2000);
    }
  };

  const onFinish = async (values: MenuInterface) => {
    let payload = {
      ...values,
      image: imageFile.length ? imageFile[0].originFileObj : undefined,
    };

    const res = await UpdateMenuById(id, payload);
    if (res.status == 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/menus");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const handleImageChange = ({ fileList }: any) => {
    setImageFile(fileList);
  };

  useEffect(() => {
    getMenuById(id);
  }, []);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>แก้ไขข้อมูลเมนู</h2>
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
                rules={[{ required: true, message: "กรุณากรอกชื่อ !" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ประเภท"
                name="category_id"
                rules={[{ required: true, message: "กรุณาเลือกประเภท !" }]}
              >
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: 1, label: "Hot" },
                    { value: 2, label: "Ice" },
                    { value: 3, label: "Frappe" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="คำอธิบาย"
                name="description"
                rules={[{ required: true, message: "กรุณากรอกคำอธิบาย !" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ราคา"
                name="price"
                rules={[{ required: true, message: "กรุณากรอกราคา !" }]}
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
              <Form.Item label="รูปภาพ" name="image">
                <Upload
                  listType="picture"
                  fileList={imageFile}
                  onChange={handleImageChange}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>อัพโหลดรูปภาพ</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          {/* ส่วนสำหรับแก้ไขวัตถุดิบ */}
          <Form.List name="ingredients">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={[16, 0]} align="middle">
                    <Col xs={20} sm={20} md={20} lg={20} xl={20}>
                      <Form.Item
                        {...field}
                        label="ชื่อวัตถุดิบ"
                        name={[field.name, "name"]}
                        rules={[{ required: true, message: "กรุณากรอกชื่อวัตถุดิบ !" }]}
                      >
                        <Input placeholder="ชื่อวัตถุดิบ" />
                      </Form.Item>
                    </Col>

                    <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                      <Button
                        type="link"
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(field.name)}
                      />
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    เพิ่มวัตถุดิบ
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Link to="/menus">
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

export default MenuEdit;
