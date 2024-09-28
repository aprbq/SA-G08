import { useState, useEffect } from "react";
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
    DatePicker,
    Select,
  } from "antd";
  import { PlusOutlined,CheckOutlined,ExclamationCircleOutlined } from "@ant-design/icons";
  import { StatusInterface } from "../../../interfaces/Status";
  import { DiscountTypeInterface } from "../../../interfaces/Discounttype";
  import { PromotionTypeInterface } from "../../../interfaces/Promotiontype";
  import { MenuInterface } from "../../../interfaces/Menu";
  import { UpdateConditionById,GetStatus,GetDiscountType,GetPromotionType,GetMenu,GetPromotionById, UpdatePromotionById,GetConditionById } from "../../../services/https";
  import { useNavigate, Link, useParams } from "react-router-dom";
  import { Modal } from "antd";
  import dayjs from "dayjs";


  const { Option } = Select;

  function PromotionEdit() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: any }>();
    const [messageApi, contextHolder] = message.useMessage();
    const [status, setStatus] = useState<StatusInterface[]>([]);
    const [promotiontype, setPromotionType] = useState<PromotionTypeInterface[]>([]);
    const [discounttype, setDiscountType] = useState<DiscountTypeInterface[]>([]);
    const [menu, setMenu] = useState<MenuInterface[]>([]);
    


    const [form] = Form.useForm();
    const getPromotionById = async (id: string) => {
      let res = await GetPromotionById(id);
      if (res.status === 200) {
        const promotionData = res.data;
        form.setFieldsValue({
          promotion_name: promotionData.promotion_name,
          description: promotionData.description,
          start_date: dayjs(promotionData.start_date),
          end_date: dayjs(promotionData.end_date),
          points_added: promotionData.points_added,
          points_use: promotionData.points_use,
          discount_value: promotionData.discount_value,
          discount_type_id: promotionData.discount_type_id,
          promotion_type_id: promotionData.promotion_type_id,
          status_id: promotionData.status_id,
        });
        getConditionById(id);
      } else {
        messageApi.open({
          type: "error",
          content: "ไม่พบข้อมูล",
        });
        setTimeout(() => {
          navigate("/promotion");
        }, 2000);
      }
    };

    const onFinish = async (values: any) => {
      Modal.confirm({
        title: "ยืนยันการสร้างโปรโมชั่น",
        content: "คุณแน่ใจหรือไม่ว่าต้องการบันทึกการแก้โปรโมชั่นนี้?",
        okText: "ตกลง",
        cancelText: "ยกเลิก",
        icon: <CheckOutlined style={{color:"green"}}/>,
        okButtonProps: { className: "confirm-button"  }, // Primary button
        cancelButtonProps: { className: "back-button" },
        className:"front-1",
        onOk: async () => {
      console.log('ค่าของฟอร์ม:', values); // แสดงค่าของฟอร์ม
      try {

        const { menu_id, points_added, points_use, discount_value, ...promotionData } = values;
    
        const promotionPayload = {
          ...promotionData,
          points_added: Number(points_added),
          points_use: Number(points_use),
          discount_value: Number(discount_value),
        };
    
        console.log('ข้อมูลโปรโมชั่นที่ส่ง:', promotionPayload);
        console.log('ข้อมูลเงื่อนไข:', menu_id);
    
        // ดำเนินการอัปเดตโปรโมชั่น
        const promotionRes = await UpdatePromotionById(id, promotionPayload);
        console.log('ผลลัพธ์จากการอัปเดตโปรโมชั่น:', promotionRes); // เพิ่มการพิมพ์ผลลัพธ์จาก API
        if (promotionRes.status === 200) {
          messageApi.open({
            type: "success",
            content: promotionRes.data.message,
          });
    
          console.log('ข้อมูลเงื่อนไขที่ส่ง:', menu_id);
          // เพิ่ม promotion_id ลงใน payload ของเงื่อนไข
          const menu_idPayload = {
            promotion_id: Number(id),
            menu: menu_id.map((item: any) => ({
              menu_id: item, // ตรวจสอบให้แน่ใจว่า key นี้ตรงกับโครงสร้างข้อมูลฟอร์ม
            })),
          };

          const menu_idRes = await UpdateConditionById(id, menu_idPayload);
          console.log('ผลลัพธ์จากการอัปเดตเงื่อนไข:', menu_idRes); // เพิ่มการพิมพ์ผลลัพธ์จาก API
    
          if (menu_idRes.status === 200) {
            messageApi.open({
              type: "success",
              content: "อัปเดตเงื่อนไขโปรโมชั่นสำเร็จ!",
            });
            setTimeout(() => {
              navigate("/promotion");
            }, 2000);
          } else {
            throw new Error("ไม่สามารถอัปเดตเงื่อนไขโปรโมชั่นได้");
          }
        } else {
          messageApi.open({
            type: "error",
            content: promotionRes.data.error,
          });
        }
      } catch (error) {
        console.error('ข้อผิดพลาด:', error);
        messageApi.open({
          type: "error",
          content: "เกิดข้อผิดพลาดขณะอัปเดตโปรโมชั่น",
        });
      }
    },
    onCancel() {
      console.log("ยกเลิกการสร้างโปรโมชั่น");
    },
    });
  };

  const onCancel = () => {
    Modal.confirm({
      title: "ยืนยันการยกเลิก",
      content: "คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการแก้โปรโมชั่นนี้?",
      okText: "ตกลง",
      cancelText: "ยกเลิก",
      className:"front-1",
      okButtonProps: { className: "confirm-button"  }, // Primary button
      cancelButtonProps: { className: "back-button" },
      icon: <ExclamationCircleOutlined style={{color:"red"}}/>,
      onOk() {
        navigate("/promotion");
      },
      onCancel() {
        console.log("ยกเลิกการยกเลิก");
      },
    });
  };
    
    
    
    const getStatus = async () => {
      let res = await GetStatus();
    if (res.status == 200) {
      setStatus(res.data);
    } else {
      setStatus([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
    };

    const getPromotionType = async () => {
      let res = await GetPromotionType();
      if (res.status == 200) {
        setPromotionType(res.data);
      } else {
        setPromotionType([]);
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    };

    const getDiscountType = async () => {
      let res = await GetDiscountType();
    if (res.status == 200) {
      setDiscountType(res.data);
    } else {
      setDiscountType([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
    };

    const getMenu = async () => {
      let res = await GetMenu();
      console.log("API Response for Menu:", res);
    if (res.status == 200) {
      setMenu(res.data);
    } else {
      setMenu([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
    };

    const getConditionById = async (id: string) => {
      let res = await GetConditionById(id);
      if (res.status === 200) {
        const conData = res.data;
        console.log('con Data:', conData);
        form.setFieldsValue({
          menu_id: conData.map((item: any) => item.menu_id),
        });
      } else {
        messageApi.open({
          type: "error",
          content: "ไม่สามารถดึงข้อมูลเมนูได้",
        });
      }
    };

    useEffect(() => {
      getStatus();
      getPromotionType();
      getDiscountType();
      getMenu();
      getConditionById(id);
      getPromotionById(id);
    }, [id]);
  
    return (
      <div>
        {contextHolder}
        <Card className="card-promotion">
          <h2 className="name-table">เพิ่มโปรโมชั่น</h2>
          <Divider />
  
          <Form
            name="basic"
            layout="vertical"
            form={form}
            onFinish={onFinish}
            autoComplete="off"
            initialValues={{
              points_added: 0,
              points_use: 0,
              discount_value: 0,
            }}

          >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label={<span className="front-1">ชื่อ</span>}
                  name="promotion_name"
                  rules={[
                    {
                      required: true,
                      message: <span className="error-front">กรุณากรอกชื่อ !</span>
                    },
                  ]}
                >
                  <Input className="front-1"/>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label={<span className="front-1">คำอธิบาย</span>}
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: <span className="error-front">กรุณากรอกคำอธิบาย !</span>
                    },
                  ]}
                >
                  <Input className="front-1"/>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label={<span className="front-1">ได้แต้ม</span>}
                  name="points_added"
                  rules={[
                    {
                      required: true,
                      message: <span className="error-front">กรุณากรอกแต้ม !</span>
                    },
                  ]}
                >
                  <Input
                    className="front-1"
                    min={0}
                    type="number"
                    defaultValue={0}
                    style={{ width: "100%" }}
                    onChange={(e) => form.setFieldsValue({ points_added: e.target.value })}
                />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label={<span className="front-1">ใช้แต้ม</span>}
                  name="points_use"
                  rules={[
                    {
                      required: true,
                      message: <span className="error-front">กรุณากรอกแต้ม !</span>
                    },
                  ]}
                >
                  <Input
                    className="front-1"
                    min={0}
                    type="number"
                    defaultValue={0}
                    style={{ width: "100%" }}
                    onChange={(e) => form.setFieldsValue({ points_use: e.target.value })}
                />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label={<span className="front-1">ส่วนลด</span>}
                  name="discount_value"
                  rules={[
                    {
                      required: true,
                      message: <span className="error-front">กรุณากรอกส่วนลด !</span>
                    },
                  ]}
                >
                  <Input
                    className="front-1"
                    min={0}
                    type="number"
                    defaultValue={0}
                    style={{ width: "100%" }}
                    onChange={(e) => form.setFieldsValue({ discount_value: e.target.value })}
                />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="discount_type_id"
                label={<span className="front-1">ประเภทส่วนลด</span>}
                rules={[{ required: true, message: <span className="error-front">กรุณาระบุประเภทส่วนลด !</span> }]}
              >
                <Select allowClear className="front-1">
                  {discounttype.map((item) => (
                    <Option value={item.ID} key={item.discount_type_name} className="front-1">
                      {item.discount_type_name}
                    </Option>
                  ))}
                </Select >
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="promotion_type_id"
                label={<span className="front-1">สำหรับ</span>}
                rules={[{ required: true, message: <span className="error-front">กรุณาระบุประเภท !</span> }]}
              >
                <Select allowClear className="front-1">
                  {promotiontype.map((item) => (
                    <Option value={item.ID} key={item.ID} className="front-1">
                      {item.promotion_type_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
              
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="status_id"
                label={<span className="front-1">สถานะ</span>}
                rules={[{ required: true, message: <span className="error-front">กรุณากรอกสถานะ !</span> }]}
              >
                <Select allowClear className="front-1">
                  {status.map((item) => (
                    <Option value={item.ID} key={item.status_name} className="front-1">
                      {item.status_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item name="menu_id" label={<span className="front-1">เมนูสำหรับโปรโมชั่น</span>} 
                  rules={[{ required: true,message: <span className="error-front">กรุณาระบุเมนู !</span> }]}>
              <Select mode="multiple" placeholder="Select menus" className="front-1">
                {menu.map((menu) => (
                <Option key={menu.ID} value={menu.ID} className="front-1">
                  {menu.name}
                </Option>
                ))}
              </Select>
              </Form.Item>
            </Col>  
            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
              <Form.Item
                label={<span className="front-1">วัน/เดือน/ปี เริ่มโปรโมชั่น</span>}
                name="start_date"
                rules={[{ required: true, 
                  message: <span className="error-front">กรุณาวันเริ่มโปรโมชั่น !</span> }]}
              >
                <DatePicker style={{ width: "100%" }} className="front-1"/>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <Form.Item
                  label={<span className="front-1">วัน/เดือน/ปี หมดโปรโมชั่น</span>}
                  name="end_date"
                  rules={[
                    { 
                      required: true, 
                      message: <span className="error-front">กรุณาวันหมดโปรโมชั่น !</span> 
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || !getFieldValue('start_date') || value.isAfter(getFieldValue('start_date'))) {
                          return Promise.resolve();
                        }
                        return Promise.reject(<span className="error-front">วันหมดโปรโมชั่นต้องมากกว่าวันเริ่มโปรโมชั่น!</span>);
                      },
                    }),
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} className="front-1"/>
                </Form.Item>
            </Col>
          </Row>
          
            <Row justify="end">
              <Col style={{ marginTop: "40px" }}>
                <Form.Item>
                  <Space>
                    <Link to="#">
                      <Button className="back-button" htmlType="button" style={{ marginRight: "10px" }} onClick={onCancel}>
                        ย้อนกลับ
                      </Button>
                    </Link>
  
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="confirm-button"
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
  
  export default PromotionEdit;