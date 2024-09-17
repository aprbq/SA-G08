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
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { MenuInterface } from "../../../interfaces/Menu";
import { CategoryInterface } from "../../../interfaces/Category";
import { StockInterface } from "../../../interfaces/Stock";
import { IngredientInterface } from "../../../interfaces/Ingredient";
import { CreateMenu, CreateMenuIngredient, GetCategory, GetStock, GetIngredients } from "../../../services/https/index";
import { useNavigate, Link } from "react-router-dom";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const { Option } = Select;

function MenuCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [category, setCategory] = useState<CategoryInterface[]>([]);
  const [stock, setStock] = useState<StockInterface[]>([]);
  const [ingredients, setIngredients] = useState<IngredientInterface[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [accountid, setAccountID] = useState<any>(localStorage.getItem("id"));

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
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

  const checkForDuplicates = (ingredientsList: any[]) => {
    const ids = new Set();
    for (const item of ingredientsList) {
      if (ids.has(item.ingredients_id)) {
        return true;  // Duplicate found
      }
      ids.add(item.ingredients_id);
    }
    return false;  // No duplicates
  };

  const onFinish = async (values: MenuInterface) => {
    if (!values.menu_ingredients || values.menu_ingredients.length === 0) {
      messageApi.open({
        type: "error",
        content: "กรุณาเพิ่มวัตถุดิบ!",
      });
      return;
    }
  
    // Check for duplicates
    if (checkForDuplicates(values.menu_ingredients)) {
      messageApi.open({
        type: "error",
        content: "วัตถุดิบมีการเพิ่มซ้ำ!",
      });
      return;
    }
  
    // Prepare payload for creating menu
    let menuPayload = {
      ...values,
      "employee_id": Number(accountid),
      "picture": fileList[0]?.thumbUrl || "", // Ensure picture is either URL or empty string
    };
  
    // Create menu
    let res = await CreateMenu(menuPayload);
  
    if (res.status === 201) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
  
      // Extract menu ID from the response
      const menuId = Number(res.data.data);
  
      // Prepare payload for creating menu ingredients
      let ingredientsPayload = {
        menu_id: Number(menuId),
        ingredients: values.menu_ingredients.map((item: any) => ({
          ingredient_id: item.ingredients_id,
          quantity: item.quantity,
        })),
      };
  
      // Create menu ingredients
      let ingredientsRes = await CreateMenuIngredient(ingredientsPayload);
  
      if (ingredientsRes.status === 201) {
        messageApi.open({
          type: "success",
          content: "เมนูและวัตถุดิบถูกเพิ่มเรียบร้อยแล้ว!",
        });
        setTimeout(() => {
          navigate("/menus");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: ingredientsRes.data.error || "ไม่สามารถเพิ่มวัตถุดิบได้",
        });
      }
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error || "ไม่สามารถสร้างเมนูได้",
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
    let res = await GetIngredients();
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
    getCategory();
    getStock();
    getIngredients();
    console.log(accountid);
  }, [accountid]);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>เพิ่มข้อมูลเมนู</h2>
        <Divider />

        <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">
          <Row gutter={[16, 0]}>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="รูปเมนู"
                name="picture"
                valuePropName="fileList"
              >
                <ImgCrop rotationSlider>
                  <Upload
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    beforeUpload={(file) => {
                      setFileList([...fileList, file]);
                      return false;
                    }}
                    maxCount={1}
                    multiple={false}
                    listType="picture-card"
                  >
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>อัพโหลด</div>
                    </div>
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>

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
              <Form.List
                name="menu_ingredients"
                initialValue={[]}
              >
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
                            <Select placeholder="Select ingredient">
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
                            <InputNumber
                              min={0}
                              style={{ width: "100%" }}
                            />
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
