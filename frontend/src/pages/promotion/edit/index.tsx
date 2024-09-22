import React, { useState, useEffect } from "react";
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
    InputNumber,
    Select,
  } from "antd";
  import { PlusOutlined } from "@ant-design/icons";
  import { PromotionInterface } from "../../../interfaces/Promotion";
  import { StatusInterface } from "../../../interfaces/Status";
  import { DiscountTypeInterface } from "../../../interfaces/Discounttype";
  import { PromotionTypeInterface } from "../../../interfaces/Promotiontype";
  import { MenuInterface } from "../../../interfaces/Menu";
  import { ConditionInterface } from "../../../interfaces/Condition";
  import { UpdateConditionById,GetStatus,GetDiscountType,GetPromotionType,GetMenu,GetPromotionById, UpdatePromotionById,GetConditionById } from "../../../services/https";
  import { useNavigate, Link, useParams } from "react-router-dom";
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
    const [condition, setCondition] = useState<ConditionInterface[]>([]);
    const [promotion, setPromotion] = useState<PromotionInterface[]>([]);
    const [isBogo, setIsBogo] = useState(false);

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
      console.log('ค่าของฟอร์ม:', values); // แสดงค่าของฟอร์ม
      try {
        const { menu_id, start_date, end_date, ...promotionData } = values;
    
        // ฟอร์แมตวันที่ก่อนส่งใน payload ของโปรโมชั่น
        const formattedStartDate = start_date?.$d ? start_date.$d.toISOString() : null;
        const formattedEndDate = end_date?.$d ? end_date.$d.toISOString() : null;
    
        const promotionPayload = {
          ...promotionData,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
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
          console.log('ppppp:', menu_idPayload);
    
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
        console.error('ข้อผิดพลาด:', error); // แสดงข้อผิดพลาดในคอนโซล
        messageApi.open({
          type: "error",
          content: "เกิดข้อผิดพลาดขณะอัปเดตโปรโมชั่น",
        });
      }
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

    const handleDiscountTypeChange = (value: number) => {
      if (value === 2) {
        setIsBogo(true); // If Bogo is selected, set to true
      } else {
        setIsBogo(false);
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
        <Card>
          <h2 className="name-table">แก้ไขข้อมูล โปรโมชั่น</h2>
          <Divider />
  
          <Form
            name="basic"
            layout="vertical"
            form={form}
            onFinish={onFinish}
            autoComplete="off"
          >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="ชื่อ"
                  name="promotion_name"
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

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
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

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="ได้แต้ม"
                  name="points_added"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกแต้ม !",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    max={99}
                    defaultValue={0}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="ใช้แต้ม"
                  name="points_use"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกแต้ม !",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    max={99}
                    defaultValue={0}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="จำนวน"
                  name="discount_value"
                  rules={[
                    {
                      required: true,
                      message: isBogo
                        ? "กรุณากรอกจำนวนเต็มสำหรับ Bogo !"
                        : "กรุณากรอกจำนวน !",
                      type: isBogo ? "integer" : "number",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    max={9999}
                    defaultValue={0}
                    style={{ width: "100%" }}
                    step={isBogo ? 1 : 0.01} 
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="discount_type_id"
                label="ประเภทส่วนลด"
                rules={[{ required: true, message: "กรุณาระบุประเภทส่วนลด !" }]}
              >
                <Select allowClear onChange={handleDiscountTypeChange}>
                  {discounttype.map((item) => (
                    <Option value={item.ID} key={item.discount_type_name}>
                      {item.discount_type_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="promotion_type_id"
                label="สำหรับ"
                rules={[{ required: true, message: "กรุณาระบุสำหรับ !" }]}
              >
                <Select allowClear>
                  {promotiontype.map((item) => (
                    <Option value={item.ID} key={item.ID}>
                      {item.promotion_type_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
              
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="status_id"
                label="สถานะ"
                rules={[{ required: true, message: "กรุณาระบุสถานะ !" }]}
              >
                <Select allowClear>
                  {status.map((item) => (
                    <Option value={item.ID} key={item.status_name}>
                      {item.status_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="menu_id"
                label="เมนูสำหรับโปรโมชั่น"
                rules={[{ required: true, message: "กรุณาระบุเมนู !" }]}
              >
                <Select mode="multiple" placeholder="Select menus">
                  {menu.map((menuItem) => (
                    <Option key={menuItem.ID} value={menuItem.ID}>
                      {menuItem.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
              <Form.Item
                label="วัน/เดือน/ปี เริ่มโปรโมชั่น"
                name="start_date"
                rules={[{ required: true, message: "กรุณาเลือกวัน/เดือน/ปี เริ่มโปรโมชั่น !" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
              <Form.Item
                label="วัน/เดือน/ปี หมดโปรโมชั่น"
                name="end_date"
                rules={[{ required: true, message: "กรุณาเลือกวัน/เดือน/ปี หมดโปรโมชั่น !" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          
            <Row justify="end">
              <Col style={{ marginTop: "40px" }}>
                <Form.Item>
                  <Space>
                    <Link to="/promotion">
                      <Button className="back-button" htmlType="button" style={{ marginRight: "10px" }}>
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