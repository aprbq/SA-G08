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

  const onFinish = async (values: MenuInterface) => {
    // Prepare payload for creating menu
    let menuPayload = {
      ...values,
      "employee_id": Number(accountid),
      "picture": fileList[0]?.thumbUrl || "", // Ensure picture is either URL or empty string
      "stock_id": 1,
    };

    // Create menu
    let res = await CreateMenu(menuPayload);

    if (res.status === 201) {
      messageApi.open({
        type: "success",
        content: res.data.message,
        className:"front-1"
      });

      // Extract menu ID from the response
      const menuId = Number(res.data.data);

      // Prepare payload for creating menu ingredients
      let ingredientsPayload = {
        menu_id: Number(menuId),
        ingredients: values.menu_ingredients!.map((item: any) => ({
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
          className:"front-1"
        });
        setTimeout(() => {
          navigate("/menus");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: ingredientsRes.data.error || "ไม่สามารถเพิ่มวัตถุดิบได้",
          className:"front-1"
        });
      }
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error || "ไม่สามารถสร้างเมนูได้",
        className:"front-1"
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
        className:"front-1"
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
        className:"front-1"
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
        className:"front-1"
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
      <Card className="card-promotion">
        <h2>เพิ่มข้อมูลเมนู</h2>
        <Divider />

        <Form name="basic" layout="vertical" onFinish={onFinish} onFinishFailed={() => {
          messageApi.error({content: <span className="front-1">กรุณาตรวจสอบข้อมูลและเพิ่มวัตถุดิบอย่างน้อยหนึ่งรายการ</span>,});
        }} autoComplete="off">
          <Row gutter={[16, 0]}>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label={<span className="front-1">รูปเมนู</span>}
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
                      <div style={{ marginTop: 8 }}  className="front-1">อัพโหลด</div>
                    </div>
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span className="front-1">ชื่อ</span>}
                name="name"
                rules={[{ required: true, message: <span className="error-front">กรุณากรอกชื่อ !</span> }]}
              >
                <Input className="front-1" placeholder="กรุณากรอกชื่อ"/>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                name="category_id"
                label={<span className="front-1">ประเภท</span>}
                rules={[{ required: true, message: <span className="error-front">กรุณาเลือกประเภท !</span> }]}
              >
                <Select allowClear className="front-1" placeholder="กรุณาเลือกประเภท">
                  {category.map((item) => (
                    <Option value={item.ID} key={item.ID} className="front-1">
                      {item.category}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span className="front-1">คำอธิบาย</span>}
                name="description"
                rules={[{ required: true, message: <span className="error-front">กรุณากรอกคำอธิบาย !</span> }]}
              >
                <Input className="front-1" placeholder="กรุณากรอกคำอธิบาย"/>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span className="front-1">ราคา</span>}
                name="price"
                rules={[{ required: true, message: <span className="error-front">กรุณากรอกราคา !</span> }]}
              >
                <InputNumber
                  min={0}
                  max={9999}
                  defaultValue={0}
                  style={{ width: "100%" }}
                  step={1}
                  className="front-1"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.List
                name="menu_ingredients"
                rules={[
                  {
                    validator: async (_, menu_ingredients) => {
                      if (!menu_ingredients || menu_ingredients.length < 1) {
                        return Promise.reject(new Error('กรุณาเพิ่มวัตถุดิบอย่างน้อยหนึ่งรายการ!'));
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={[16, 0]} align="middle">
                        <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                        <Form.Item
                            {...restField}
                            name={[name, 'ingredients_id']}
                            label={<span className="front-1">วัตถุดิบ</span>}
                            rules={[{ required: true, message: <span className="error-front">กรุณาเลือกวัตถุดิบ !</span> }]}
                          >
                            <Select placeholder="เลือกวัตถุดิบ" className="front-1" showSearch>
                              {ingredients.map((item) => (
                                <Option value={item.ID} key={item.ID} className="front-1">
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
                            label={<span className="front-1">จำนวน</span>}
                            rules={[{ required: true, message: <span className="error-front">กรุณากรอกจำนวน !</span> }]}
                          >
                            <Input style={{ width: '100%' }} className="front-1" placeholder="กรุณากรอกจำนวน"/>
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                          <Button
                            type="link"
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                            className="front-blue"
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
                        className="front-1"
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
                    <Button htmlType="button" style={{ marginRight: "10px" }} className="front-1">
                      ย้อนกลับ
                    </Button>
                  </Link>

                  <Button type="primary" htmlType="submit" icon={<PlusOutlined />} className="front-white">
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
