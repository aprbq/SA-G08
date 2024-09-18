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
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { CategoryInterface } from "../../../interfaces/Category";
import { StockInterface } from "../../../interfaces/Stock";
import { IngredientInterface } from "../../../interfaces/Ingredient";
import {
  GetMenuById,
  UpdateMenuById,
  GetCategory,
  GetStock,
  GetMenuIngredientById,
  UpdateMenuIngredientById,
  GetIngredients,   // <-- Import the new service here
} from "../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";

const { Option } = Select;

function MenuEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [category, setCategory] = useState<CategoryInterface[]>([]);
  const [stock, setStock] = useState<StockInterface[]>([]);
  const [ingredients, setIngredients] = useState<IngredientInterface[]>([]);
  const [form] = Form.useForm();

  const getMenuById = async (id: string) => {
    let res = await GetMenuById(id);
    if (res.status === 200) {
      const menuData = res.data;
      form.setFieldsValue({
        name: menuData.name,
        price: menuData.price,
        picture: menuData.picture,
        description: menuData.description,
        category_id: menuData.category_id,
        stock_id: menuData.stock_id,
      });
      getMenuIngredientsById(id);  // <-- Fetch ingredients after setting menu data
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูล",
      });
      setTimeout(() => {
        navigate("/menus");
      }, 2000);
    }
  };

  const getMenuIngredientsById = async (id: string) => {
    let res = await GetMenuIngredientById(id);
    if (res.status === 200) {
      const ingredientData = res.data;
      console.log('Ingredient Data:', ingredientData);  // ตรวจสอบข้อมูลที่ได้รับ
      form.setFieldsValue({
        menu_ingredients: ingredientData.map((item: any) => ({
          ingredients_id: item.name,
          quantity: item.quantity,
        })),
      });
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่สามารถดึงข้อมูลวัตถุดิบได้",
      });
    }
  };
  
  const onFinish = async (values: any) => {
    try {
      let payload = {
        ...values,
        menu_ingredients: values.menu_ingredients.map((item: any) => ({
          ingredients_id: item.ingredients_id,
          quantity: item.quantity,
        })),
      };
  
      // Update the menu
      const menuRes = await UpdateMenuById(id, payload);
      if (menuRes.status === 200) {
        messageApi.open({
          type: "success",
          content: menuRes.data.message,
        });
  
        // Now update the menu ingredients
        const ingredientsRes = await UpdateMenuIngredientById(id, values.menu_ingredients);
        if (ingredientsRes.status === 200) {
          messageApi.open({
            type: "success",
            content: 'Menu ingredients updated successfully!',
          });
        } else {
          throw new Error('Failed to update menu ingredients');
        }
  
        setTimeout(() => {
          navigate("/menus");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: menuRes.data.error,
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: 'An error occurred while updating the menu.',
      });
    }
  };
  

  const getCategory = async () => {
    let res = await GetCategory();
    if (res.status === 200) {
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
    if (res.status === 200) {
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
    let res = await GetIngredients();console.log("Ingredients state:", ingredients);
    if (res.status === 200) {
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
    
  }, [id]);

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
                    <Option value={item.ID} key={item.ID}>
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
                    <Option value={item.ID} key={item.ID}>
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

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.List name="menu_ingredients">
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <Row key={key} gutter={[16, 0]} align="middle">
          <Col xs={12} sm={12} md={8} lg={8} xl={8}>
            <Form.Item
              {...restField}
              name={[name, 'ingredients_id']}
              label="วัตถุดิบ"
              rules={[{ required: true, message: 'กรุณากรอกวัตถุดิบ!' }]}
            >
              <Select
                placeholder="เลือกวัตถุดิบ"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {ingredients.map((item) => (
                  <Option value={item.ID} key={item.ID}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={12} sm={12} md={8} lg={8} xl={8}>
            <Form.Item
              {...restField}
              name={[name, 'quantity']}
              label="จำนวน"
              rules={[{ required: true, message: 'กรุณากรอกจำนวน!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Button
              type="link"
              icon={<MinusCircleOutlined />}
              onClick={() => remove(name)}
            >
              ลบ
            </Button>
          </Col>
        </Row>
      ))}

      <Form.Item>
        <Button
          type="dashed"
          onClick={() => add()}
          block
          icon={<PlusOutlined />}
        >
          เพิ่มวัตถุดิบ
        </Button>
      </Form.Item>
    </>
  )}
</Form.List>


            </Col>
          </Row>

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
