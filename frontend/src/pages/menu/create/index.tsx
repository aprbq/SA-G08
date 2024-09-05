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
import { CreateMenu } from "../../../services/https";
import { useNavigate, Link } from "react-router-dom";

function MenuCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

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

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

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
                label="ประเภท"
                name="category_id"
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
