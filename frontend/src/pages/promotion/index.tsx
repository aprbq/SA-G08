import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Modal } from "antd";
import { PlusOutlined, DeleteOutlined , EditOutlined} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetPromotion, DeletePromotionById } from "../../services/https/index";
import { PromotionInterface } from "../../interfaces/Promotion";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { confirm } = Modal;

function Promotion() {
  const navigate = useNavigate();
  const [Promotion , setPromotion] = useState<PromotionInterface[]>([]);
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
      render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
      className:  "front-1",
    },

    {
      title: "วันสิ้นสุด",
      key: "end_date",
      render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
      className:  "front-1",
    },

    {
    title: "สถานะ",
    dataIndex: "Status",
    key: "status_id",
    render: (item) => Object.values(item.status_name),
    className:  "front-1",
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
          <Space>
            <Link to="/promotion/create">
              <Button className = "btn-1" type="primary" icon={<PlusOutlined />}>
                สร้างโปรโมชั่น
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
          style={{ width: "100%", overflow: "scroll" }}
        />
      </div>
    </>
  );
}
export default Promotion;