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
import { CategoryInterface } from "../../../interfaces/Category";
import {CreateMenu, GetCategory} from "../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
const { Option } = Select;

function MenuCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [category, setCategory] = useState<CategoryInterface[]>([]);

  const onFinish = async (values: MenuInterface) => {
    let res = await CreateMenu(values);

    if (res.status === 201) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(function () {
        navigate("/menus");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getCategory = async () => {
    let res = await GetCategory();
    if (res) {
      setCategory(res);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  useEffect(() => {
    getCategory();
    
  }, []);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>เพิ่มข้อมูลเมนู</h2>
        <Divider />

        <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">
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
              name="category_id"
              label="ประเภท"
              rules={[{ required: true, message: "กรุณาเลือกประเภท !" }]}
            >
              <Select allowClear>
                {category.map((item) => (
                  <Option value={item.ID} key={item.category}>
                    {item.category}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="คำอธิบาย"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกคำอธิบาย !",
                  },
                ]}
              >
                <Input />
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
                label="รูปภาพ"
                name="image"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: true,
                    message: "กรุณาอัพโหลดรูปภาพ !",
                  },
                ]}
              >
                <Upload name="image" listType="picture" maxCount={1}>
                  <Button icon={<UploadOutlined />}>คลิกเพื่ออัพโหลด</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          {/* เพิ่มส่วนสำหรับการเพิ่มวัตถุดิบหลายรายการ */}
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
                        rules={[
                          { required: true, message: "กรุณากรอกชื่อวัตถุดิบ !" },
                        ]}
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

                  <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
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

export default MenuCreate;
