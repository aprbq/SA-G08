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
import ImgCrop from "antd-img-crop";
import { GetMenuById, UpdateMenuById, GetCategory, GetStock, GetMenuIngredientById, UpdateMenuIngredientById, GetIngredients , GetUnits} from "../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
import type { GetProp, UploadFile, UploadProps } from "antd";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const { Option } = Select;

function MenuEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [category, setCategory] = useState<any[]>([]);
  const [stock, setStock] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]); // State for image file list
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
      });

      setFileList([{ url: menuData.picture }]);  // Set existing image in file list
      getMenuIngredientsById(id);
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูล",
        className:"front-1"
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
      form.setFieldsValue({
        menu_ingredients: ingredientData.map((item: any) => ({
          ingredients_id: item.ingredients_id,
          quantity: item.quantity,
        })),
      });
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่สามารถดึงข้อมูลวัตถุดิบได้",
        className:"front-1"
      });
    }
  };

  const onFinish = async (values: any) => {
    try {
      const { menu_ingredients, ...menuData } = values;

      // Add image to payload
      const imagePayload = {
        picture: fileList[0]?.url || fileList[0]?.thumbUrl || "", // Use the uploaded image URL
      };

      const menuRes = await UpdateMenuById(id, { ...menuData, ...imagePayload });
      if (menuRes.status === 200) {
        messageApi.open({
          type: "success",
          content: menuRes.data.message,
          className:"front-1"
        });

        const ingredientsPayload = {
          menu_id: Number(id),
          ingredients: menu_ingredients.map((item: any) => ({
            ingredients_id: item.ingredients_id,
            quantity: item.quantity,
          })),
        };

        const ingredientsRes = await UpdateMenuIngredientById(id, ingredientsPayload);

        if (ingredientsRes.status === 200) {
          messageApi.open({
            type: "success",
            content: "อัปเดตส่วนประกอบเมนูสำเร็จ",
            className:"front-1"
          });
        } else {
          throw new Error("อัปเดตส่วนประกอบเมนูไม่สำเร็จ");
          className:"front-1"
        }

        setTimeout(() => {
          navigate("/menus");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: menuRes.data.error,
          className:"front-1"
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดขณะอัปเดตเมนู",
        className:"front-1"
      });
    }
  };

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
    let res = await GetIngredients(); console.log("Ingredients state:", ingredients);
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

  const getUnit = async () => {
    let res = await GetUnits(); // Fetch units from the API
    if (res.status === 200) {
      setUnits(res.data);
    } else {
      setUnits([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
        className: "front-1",
      });
    }
  };

  useEffect(() => {
    getMenuById(id);
    getCategory();
    getStock();
    getUnit();
    getIngredients();
  }, [id]);

  return (
    <div>
      {contextHolder}
      <Card className="card-promotion">
        <h2 className="heading-menu">แก้ไขข้อมูลเมนู</h2>
        <Divider />

        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={() => {
            messageApi.error({content: <span className="front-1">กรุณาตรวจสอบข้อมูลและเพิ่มวัตถุดิบอย่างน้อยหนึ่งรายการ</span>,});
          }}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>

            {/* ส่วนอัปโหลดรูปภาพ */}
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item label={<span className="front-1">รูปเมนู</span>} name="picture" valuePropName="fileList">
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
                      <div style={{ marginTop: 8 }} className="front-1">อัพโหลด</div>
                    </div>
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label={<span className="front-1">ชื่อ</span>}
                name="name"
                rules={[{ required: true, message: <span className="error-front">กรุณากรอกชื่อ !</span> }]}
              >
                <Input className="front-1" placeholder="กรุณากรอกชื่อ"/>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
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

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label={<span className="front-1">คำอธิบาย</span>}
                name="description"
                rules={[{ required: true, message: <span className="error-front">กรุณากรอกคำอธิบาย !</span> }]}
              >
                <Input className="front-1" placeholder="กรุณากรอกคำอธิบาย"/>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
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
                  placeholder="กรุณากรอกราคา"
                />
              </Form.Item>
            </Col>

            {/* ส่วนจัดการส่วนประกอบเมนู */}
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.List
                name="menu_ingredients"
                rules={[
                  {
                    validator: async (_, menu_ingredients) => {
                      if (!menu_ingredients || menu_ingredients.length < 1) {
                        return Promise.reject(new Error('กรุณาเพิ่มวัตถุดิบอย่างน้อยหนึ่งรายการ!') );
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
                              {ingredients.map((item) => {
                                const unit = units.find((u) => u.ID === item.unit_id); // Find the unit
                                return (
                                  <Option value={item.ID} key={item.ID} className="front-1">
                                    {item.name} {unit ? `(${unit.unit})` : ''} {/* Display the unit */}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'quantity']}
                            label={<span className="front-1">จำนวน</span>}
                            rules={[
                              { required: true, message: <span className="error-front">กรุณากรอกจำนวน !</span> },
                            ]}
                          >
                            <InputNumber
                              min={0}
                              max={9999}
                              defaultValue={0}
                              style={{ width: "100%" }}
                              step={1}
                              className="front-1"
                              placeholder="กรุณากรอกจำนวน"
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                          <Button type="link" icon={<MinusCircleOutlined />} onClick={() => remove(name)} className="front-blue">
                            ลบ
                          </Button >
                        </Col>
                      </Row>
                    ))}

                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="front-1">
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

export default MenuEdit;
