import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Modal,List, Typography,Input } from "antd";
import { PlusOutlined, DeleteOutlined , EditOutlined,HistoryOutlined,EyeOutlined,SearchOutlined} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetPromotion, DeletePromotionById,GetConditionById,UpdatePromotionById } from "../../services/https/index";
import { PromotionInterface } from "../../interfaces/Promotion";
import { MenuInterface } from "../../interfaces/Menu";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { confirm } = Modal;
const { Title, Text } = Typography;

function Promotion() {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Promotion , setPromotion] = useState<PromotionInterface[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<MenuInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const updatePromotionStatus = async (id: string) => {
    try {
      // เรียก API เพื่ออัปเดตสถานะเป็น "Unactive"
      const res = await UpdatePromotionById(id, { status_id: 2 });
      if (res.status === 200) {
        messageApi.success("สถานะโปรโมชั่นได้ถูกอัปเดตเป็น Unactive");
      } else {
        messageApi.error(res.data.error);
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการอัปเดตสถานะโปรโมชั่น");
    }
  };

  
  const columns: ColumnsType<PromotionInterface> = [

    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
      className:  "front-1",
      
    },
  
    {
      title: "ชื่อ",
      dataIndex: "promotion_name",
      key: "promotion_name",
    },

    {
      title: "คำอธิบาย",
      dataIndex: "description",
      key: "description",

    },

    {
      title: "ได้แต้ม",
      dataIndex: "points_added",
      key: "points_added",
    },

    {
      title: "ใช้แต้ม",
      dataIndex: "points_use",
      key: "points_use",
      className:  "front-1",
    },

    {
        title: "จำนวน",
        dataIndex: "discount_value",
        key: "discount_value",
    },
    
    {
      title: "ประเภท",
      dataIndex: "DiscountType",
      key: "discount_type_id",
      render: (item) => Object.values(item.discount_type_name),
    },

    {
      title: "สำหรับ",
      dataIndex:"PromotionType",
      key: "promotion_type_id",
      render: (item) => Object.values(item.promotion_type_name),
    },

    {
      title: "วันเริ่ม",
      key: "start_date",
      render: (record) => <>{dayjs(record.start_date).format("DD/MM/YYYY")}</>,
    },

    {
      title: "วันสิ้นสุด",
      key: "end_date",
      render: (record) => <>{dayjs(record.end_date).format("DD/MM/YYYY")}</>,
    },

    {
    title: "สถานะ",
    dataIndex: "Status",
    key: "status_id",
    render: (item) => {
      const statusColor = item.status_name.toLowerCase() === "active" ? "green" : 
                          item.status_name.toLowerCase() === "unactive" ? "red" : "";
      return (
        <span
          style={{
            backgroundColor: statusColor,
            padding: "4px 8px",
            borderRadius: "4px",
            color: "white",
          }}
        >
          {item.status_name}
        </span>
      );
    },
    },

    {
      title: "เมนูที่ใช้งานได้",
      key: "menu",
      className:  "front-1",
      render: (record) => (
        <Button
          type="default"
          className=  "front-1"
          icon={<EyeOutlined />}
          onClick={() => handleViewMenu(record.ID)} // แก้ไขเป็นดึงจาก API
        >
          ดูเมนู
        </Button>
      ),
    },
    
    {
      title: "",
      render: (record) => (
        <>
          <Button
            className="btn-1"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/promotion/edit/${record.ID}`)}
          >
            แก้ไขข้อมูล
          </Button>
        </>
      ),
    },
    {
        title: "",
        render: (record) => (
          <>
            <Button
                type="primary"
                className="btn-delete"
                icon={<DeleteOutlined />}
                onClick={() => showDeleteConfirm(record.ID)}
            ></Button>
          </>
        ),
      },
  ];

  const deletePromotionById = async (id: string) => {
    try {
      // เรียกฟังก์ชันที่ลบโปรโมชั่นและลบเงื่อนไข
      let res = await DeletePromotionById(id);
      if (res.status === 200) {
        messageApi.open({
          type: "success",
          content: res.data.message,
        });
        await getPromotion(); // รีเฟรชรายการโปรโมชั่น
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        className:  "front-1",
        content: "เกิดข้อผิดพลาดในการลบโปรโมชั่น",
      });
    }
  };

  const showDeleteConfirm = (id: string) => {
    confirm({
      title: "คุณแน่ใจหรือว่าต้องการลบ'โปรโมชั่น'",
      content: "การลบจะไม่สามารถยกเลิกได้",
      okText: "ยืนยัน",
      okType: "danger",
      cancelText: "ยกเลิก",
      className:  "front-1",
      onOk() {
        deletePromotionById(id);
      },
      onCancel() {
        console.log("ยกเลิกการลบ");
      },
    })};

    const getPromotion = async () => {
      let res = await GetPromotion();
      if (res.status === 200) {
        const currentTime = dayjs();
        const updatedPromotions = res.data.map((promo: PromotionInterface) => {
          // เช็คว่า end_date น้อยกว่าปัจจุบันและสถานะไม่ใช่ Unactive
          if (dayjs(promo.end_date).isBefore(currentTime) && promo.status_id !== 2) {
            // อัปเดตสถานะในฐานข้อมูล
            if (promo.ID !== undefined) {
              // อัปเดตสถานะในฐานข้อมูล
              updatePromotionStatus(promo.ID.toString()); // แปลงเป็น string
            }
            // อัปเดตสถานะใน React state
            return { ...promo, Status: { status_id: 2, status_name: "Unactive" } };
          }
          return promo; // คืนโปรโมชั่นที่ไม่เปลี่ยนแปลง
        });
        setPromotion(updatedPromotions);
      } else {
        setPromotion([]);
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    };

  const handleViewMenu = async (promotionID: string) => {
    try {
      const res = await GetConditionById(promotionID);
      console.log('API Response:', res);
  
      if (res.status === 200) {
        console.log('Menu:', res.data);
        setSelectedMenu(res.data || []);
        setIsModalVisible(true);
      } else if (res.status === 204) {
        messageApi.error("ไม่พบเมนู");
      } else {
        messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลเมนู");
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลเมนู");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    getPromotion();
  }, []);

  return (
    <>
      {contextHolder}
      <Row>
        <Col className = "name-table" span={12}>
          <h2>จัดการโปรโมชั่น</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space direction="vertical">
            <Link to="/promotion/create">
              <Button className = "btn-1" type="primary" icon={<PlusOutlined />}>
                สร้างโปรโมชั่น
              </Button>
            </Link>
            <Link to="/promotion/history">
              <Button className = "btn-3" type="primary" icon={<HistoryOutlined />}>
                ประวัติการใช้งาน
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Divider />
      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={Promotion}
          className="custom-table" 
          rowClassName={(record, index) => 
            index % 2 === 0 ? "table-row-light table-row-hover" : "table-row-dark table-row-hover"
          }
        />
      </div>
      <Modal
        className= "front-1"
        title="เมนูที่ใช้งานได้"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedMenu.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={selectedMenu}
            renderItem={(menu) => (
              <List.Item>
                <List.Item.Meta
                  title={<Text className= "front-2" strong>{menu.name}</Text>}
                />
              </List.Item>
            )}
          />
        ) : (
          <p className=  "front-1">ไม่มี</p>
        )}
      </Modal>
    </>
  );
}
export default Promotion;