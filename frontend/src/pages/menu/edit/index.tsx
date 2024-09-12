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
import { StockInterface } from "../../../interfaces/Stock";
import { IngredientInterface } from "../../../interfaces/Ingre";
import { GetMenuById, UpdateMenuById, GetCategory, GetStock, GetIngredients} from "../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
const { Option } = Select;

function MenuEdit() {
  const navigate = useNavigate();
  // รับข้อมูลจาก params
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  // const [menu, setMenu] = useState<MenuInterface>();
  const [category, setCategory] = useState<CategoryInterface[]>([]);
  const [stock, setStock] = useState<StockInterface[]>([]);
  const [ingredients , setIngredients] = useState<IngredientInterface[]>([]);
  
  
  // อ้างอิง form กรอกข้อมูล
  const [form] = Form.useForm();

  const getMenuById = async (id: string) => {
    let res = await GetMenuById(id);
    if (res.status == 200) {
      form.setFieldsValue({
        name: res.data.name,
        price: res.data.price,
        picture: res.data.picture,
        description: res.data.description,
        category_id: res.data.category_id,
        stock_id: res.data.stock_id,
        ingredients: res.data.ingredients_id || [], 
      });
    }else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูล",
      });
      setTimeout(() => {
        navigate("/menu");
      }, 2000);
    }
      
  };

  const onFinish = async (values: MenuInterface) => {
    let payload = {
      ...values,
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

  const getCategory = async () => {
    let res = await GetCategory();
    if (res.status == 200) {
      setCategory(res.data);
    } else {
      setCategory([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getStock = async () => {
    let res = await GetStock();
    if (res.status == 200) {
      setStock(res.data);
    } else {
      setStock([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getIngredients = async () => {
    let res = await GetIngredients();
    if (res.status == 200) {
      setIngredients(res.data);
    } else {
      setIngredients([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getMenuById(id);
    getCategory();
    getStock();
    getIngredients();
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
              name="stock_id"
              label="สถานะ"
              rules={[{ required: true, message: "กรุณาเลือกสถานะ !" }]}
            >
              <Select allowClear>
                {stock.map((item) => (
                  <Option value={item.ID} key={item.stock}>
                    {item.stock}
                  </Option>
                ))}
              </Select>
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

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item name="ingredient_id" label="วัตถุดิบ" rules={[{ required: true }]}>
              <Select mode="multiple" placeholder="Select ingredient">
                {ingredients.map((item) => (
                <Option key={item.ID} value={item.ID}>
                  {item.name}
                </Option>
                ))}
              </Select>
              </Form.Item>
            </Col>

        
          </Row>

          {/* ส่วนสำหรับแก้ไขวัตถุดิบ */}
          {/* <Form.List name="ingredients">
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
          </Form.List> */}

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
