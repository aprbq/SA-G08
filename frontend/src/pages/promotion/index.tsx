import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message } from "antd";
import { PlusOutlined, DeleteOutlined , EditOutlined} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetPromotion, DeletePromotionById } from "../../services/https/index";
import { PromotionInterface } from "../../interfaces/Promotion";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function Promotion() {
  const navigate = useNavigate();
  const [Promotion , setPromotion] = useState<PromotionInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();


  const columns: ColumnsType<PromotionInterface> = [


    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
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
    },
    {
        title: "จำนวน",
        dataIndex: "discount_value",
        key: "discount_value",
    },
    {
        title: "ประเภท",
        dataIndex:"discount_type_id",
        key: "discount_type_id",
    },
    {
      title: "สำหรับ",
      dataIndex:"promotion_type",
      key: "promotion_type",
      render: (item) => item ? item.PromotionTypeName : "ไม่มีข้อมูล",
    },
    {
      title: "วันเริ่ม",
      key: "start_date",
      render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "วันสิ้นสุด",
      key: "end_date",
      render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
    },
    {
    title: "สถานะ",
    dataIndex: "status",
    key: "status",
    render: (item) => item ? item.status : "ไม่มีข้อมูล",
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
                onClick={() => deletePromotionById(record.ID)}
            ></Button>
          </>
        ),
      },
  ];

  const deletePromotionById = async (id: string) => {
    let res = await DeletePromotionById(id);

    if (res.status == 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      await getPromotion();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

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