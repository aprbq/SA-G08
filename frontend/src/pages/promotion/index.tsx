import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Modal,List, Typography,Input } from "antd";
import { PlusOutlined, DeleteOutlined , EditOutlined,HistoryOutlined,EyeOutlined,SearchOutlined} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetPromotion, DeletePromotionById,GetConditionById } from "../../services/https/index";
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
  const [searchText, setSearchText] = useState("");
  const [filteredPromotion, setFilteredPromotion] = useState<PromotionInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  
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
      className:  "front-1",
    },

    {
      title: "คำอธิบาย",
      dataIndex: "description",
      key: "description",
      className:  "front-1",
    },

    {
      title: "ได้แต้ม",
      dataIndex: "points_added",
      key: "points_added",
      className:  "front-1",
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
        className:  "front-1",
    },
    
    {
      title: "ประเภท",
      dataIndex: "DiscountType",
      key: "discount_type_id",
      render: (item) => Object.values(item.discount_type_name),
      className:  "front-1",
    },

    {
      title: "สำหรับ",
      dataIndex:"PromotionType",
      key: "promotion_type_id",
      render: (item) => Object.values(item.promotion_type_name),
      className:  "front-1",
    },

    {
      title: "วันเริ่ม",
      key: "start_date",
      render: (record) => <>{dayjs(record.start_date).format("DD/MM/YYYY")}</>,
      className:  "front-1",
    },

    {
      title: "วันสิ้นสุด",
      key: "end_date",
      render: (record) => <>{dayjs(record.end_date).format("DD/MM/YYYY")}</>,
      className:  "front-1",
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
    className: "front-1",
    },

    {
      title: "เงื่อนไข",
      key: "menu",
      render: (record) => (
        <Button
          type="default"
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
    if (res.status == 200) {
      setPromotion(res.data);
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

  const handleSearch = (value: string) => {
    setSearchText(value);
    if (value === "") {
      setFilteredPromotion(Promotion); // คืนข้อมูลทั้งหมดถ้าค้นหาว่างเปล่า
    } else {
      const filtered = Promotion.filter((promo) =>
        promo.promotion_name
          ? promo.promotion_name.toLowerCase().includes(value.toLowerCase()) // ตรวจสอบว่า promotion_name ไม่เป็น undefined
          : false // ถ้าเป็น undefined ให้ข้ามไป
      );
      setFilteredPromotion(filtered);
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
              <Button className = "btn-history" type="primary" icon={<HistoryOutlined />}>
                ประวัติการใช้งาน
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <Input
            placeholder="ค้นหาโปรโมชั่น"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)} // เรียกใช้ handleSearch เมื่อมีการเปลี่ยนแปลง
          />
        </Col>
      </Row>
      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={Promotion}
          style={{ width: "100%", overflow: "scroll" }}
          className="custom-table" // ใส่คลาสที่กำหนดให้กับตาราง
          rowClassName={(record, index) => 
            index % 2 === 0 ? "table-row-light table-row-hover" : "table-row-dark table-row-hover"
          }
        />
      </div>
      <Modal
        title="เมนูเงื่อนไข"
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
                  title={<Text strong>{menu.name}</Text>}
                />
              </List.Item>
            )}
          />
        ) : (
          <p>ไม่มีวัตถุดิบสำหรับเมนูนี้</p>
        )}
      </Modal>
    </>
  );
}
export default Promotion;